/**
 * AWS lambda function that runs every 2 days. It uses SerpApi to retrieve the top 50 local Humboldt events from Google. 
 * This information is then parsed and put into a format that the mySQL Events table expects so that it can be entered into it.
 */

import { Context, Callback } from 'aws-lambda';
import { getJson } from 'serpapi';

interface SerpEventResponse {
  title: string;
  date: {
    start_date: string;
    when: string;
  };
  address: string[];
  link: string;
  event_location_map: {
    image: string;
    link: string;
    serpapi_link: string;
  };
  description?: string;
  ticket_info?: TicketInfo[];
  venue?: {
    name: string;
    reviews?: number;
    link: string;
  };
  thumbnail?: string;
  image?: string;
};

interface TicketInfo {
  source: string;
  link: string;
  link_type: string;
};

export type Event = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  latitude: number | null;
  longitude: number | null;
  organizer: string;
  tags: string[];
  photoUrls: string[];
  websiteURL: string | null;
};

function extractPhysicalAddress(addressArray: string[]): string {
  if (addressArray.length >= 2) {
    const parts = addressArray[0].split(',');

    if (parts.length === 2) {
      return parts[1].trim() + ', ' + addressArray[1].trim();
    } else {
      return addressArray.join(', ');
    }
  } else {
    console.error('Unexpected address format: ', addressArray);
    return addressArray.join(', ');
  }
};

function formatDateForMySQL(dateString: string): string {
  // Months array to convert month from name to number
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateParts = dateString.split(' ');

  // Handle invalid format
  if (dateParts.length !== 2) {
    throw new Error('Invalid date format');
  }

  // Extract the month and day
  const monthName = dateParts[0];
  const day = dateParts[1];

  // Get the current year and month
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // Months are 0-indexed in JavaScript

  // Convert month name to number (0-indexed)
  const eventMonth = months.indexOf(monthName);
  if (eventMonth === -1) {
    throw new Error('Invalid month name');
  }

  // If the event month is earlier in the year than the current month, 
  // we assume the event is happening next year.
  const eventYear = (eventMonth < currentMonth) ? currentYear + 1 : currentYear;

  const date = new Date(eventYear, eventMonth, parseInt(day));

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dateOfMonth = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${dateOfMonth}`;
}

function getTimeFromDate(dateString: string): string {
  try {

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '';
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();

    let hoursIn12HourFormat = hours % 12;
    hoursIn12HourFormat = hoursIn12HourFormat || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

    return hoursIn12HourFormat + ':' + minutesFormatted + ' ' + ampm;
  } catch (error) {
    console.error("An error occurred while parsing the date: ", error);
    return '';
  }
};

async function getLatLong(address: string[]): Promise<{ latitude: number; longitude: number; }> {
  if (address.length <= 0) throw new Error("No Address found!");

  const addr = extractPhysicalAddress(address);
  const url = `https://geocode.maps.co/search?q=${encodeURIComponent(addr)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.length === 0) {
    return {
      latitude: null,
      longitude: null
    };
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  };
};

async function createEvents(eventsArr: SerpEventResponse[]): Promise<Event[]> {
  const results: Event[] = [];

  for (const e of eventsArr) {
    try {
      const { latitude, longitude } = await getLatLong(e.address);
      const eventToBeSubmitted: Event = {
        name: e.title,
        description: e.date.when + '; ' + e.description,
        location: e.address && e.address[0] ? e.address[0] : '',
        addedByUserID: 'GoogleEventsScraper',
        date: formatDateForMySQL(e.date.start_date),
        time: getTimeFromDate(e.date.when),
        latitude: latitude,
        longitude: longitude,
        organizer: e.venue?.name ?? '',
        tags: [e.venue?.name ?? ''],
        photoUrls: [e.image],
        websiteURL: e.link ?? e.venue?.link ?? ''
      };

      results.push(eventToBeSubmitted);

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed for event ${e.title}: ${error}`);
    }
  }

  return results;
};

export const handler = async (event: any, context: Context, callback: Callback) => {

  const baseParams = {
    engine: "google_events",
    q: "Events in Humboldt County",
    hl: "en",
    gl: "us",
    location_requested: "Arcata, California, United States",
    api_key: "9e002587c4c43e1a6b96ef962e7e5b932dbad6f2d105d1d912a5512547ec3748"
  };

  let allSerpEvents: SerpEventResponse[] = [];

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  for (let start of [0, 10, 20, 30, 40]) {
    try {
      const params = { ...baseParams, start: start.toString() };
      const serpEventsJson = await getJson(params);
      const serpEventsArr: SerpEventResponse[] = serpEventsJson["events_results"] || [];
      allSerpEvents = allSerpEvents.concat(serpEventsArr);

      if (start !== 40) {
        await delay(1000);
      }
    } catch (error) {
      console.error(`Error fetching events for start ${start}: `, error);
    }
  }

  const eventsToBeAdded: Event[] = await createEvents(allSerpEvents);

  for (let i = 0; i < eventsToBeAdded.length; i++) {
    const e: Event = eventsToBeAdded[i];
    try {
      const res = await fetch('https://38tmnse7u5.execute-api.us-west-1.amazonaws.com/add-event', {
        method: 'POST',
        body: JSON.stringify(e),
      });
      console.log(res);
    } catch (error) {
      console.error(`Error sending event ${e.name}: `, error);
    }
    // Delay for 1 second
    if (i < eventsToBeAdded.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  callback(null, 'Finished');
};
