/**
 * @file cloud_functions/functions/src/index.ts
 * @filename contains the server functions used in Humspot.
 */


import * as logger from "firebase-functions/logger";

import { onSchedule } from "firebase-functions/v2/scheduler";
import { getJson } from "serpapi";
import { Timestamp } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

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
  description?: string | undefined;
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

interface Event {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: Timestamp;
  time: string;
  latitude: number | null;
  longitude: number | null;
  organizer: string;
  tags: string[];
  photoUrls: string[];
  websiteURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function extractPhysicalAddress(addressArray: string[]): string {
  if (addressArray.length >= 2) {
    const parts = addressArray[0].split(",");

    if (parts.length === 2) {
      return parts[1].trim() + ", " + addressArray[1].trim();
    } else {
      return addressArray.join(", ");
    }
  } else {
    logger.error("Unexpected address format: ", addressArray);
    return addressArray.join(", ");
  }
};


function formatDateForFirestore(dateString: string): Timestamp {
  // Month array to convert month name to number
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateParts = dateString.split(" ");

  if (dateParts.length !== 2) {
    throw new Error("Invalid date format");
  }

  const monthName = dateParts[0];
  const day = dateParts[1];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const eventMonth = months.indexOf(monthName);
  if (eventMonth === -1) {
    throw new Error("Invalid month name");
  }

  const eventYear = (eventMonth < currentMonth) ? currentYear + 1 : currentYear;
  const formattedDate = new Date(eventYear, eventMonth, parseInt(day));

  // Convert to Firestore Timestamp
  return Timestamp.fromDate(formattedDate);
};

function getTimeFromDate(dateString: string): string {
  try {

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();

    let hoursIn12HourFormat = hours % 12;
    hoursIn12HourFormat = hoursIn12HourFormat || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

    return hoursIn12HourFormat + ":" + minutesFormatted + " " + ampm;
  } catch (error) {
    logger.error("An error occurred while parsing the date: ", error);
    return "";
  }
};

async function getLatLong(address: string[]): Promise<{ latitude: number | null; longitude: number | null; }> {
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

async function createEvents(eventsArr: SerpEventResponse[]): Promise<Omit<Event, "createdAt" | "updatedAt">[]> {
  const results: Omit<Event, "createdAt" | "updatedAt">[] = [];

  for (const e of eventsArr) {
    try {
      const { latitude, longitude } = await getLatLong(e.address);
      const eventToBeSubmitted: Omit<Event, "createdAt" | "updatedAt"> = {
        name: e.title,
        description: e.date.when + "; " + (e.description && e.description !== undefined && e.description !== "undefined" ? e.description : "No description available"),
        location: e.address && e.address[0] ? e.address[0] : "",
        addedByUserID: "GoogleEventsScraper",
        date: formatDateForFirestore(e.date.start_date),
        time: getTimeFromDate(e.date.when),
        latitude: latitude,
        longitude: longitude,
        organizer: e.venue?.name ?? "",
        tags: [e.venue?.name ?? ""],
        photoUrls: [e.image ?? ""],
        websiteURL: e.link ?? e.venue?.link ?? "",
      };

      results.push(eventToBeSubmitted);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error(`Failed for event ${e.title}: ${error}`);
    }
  }

  return results;
}

async function addEvent(eventData: Omit<Event, "createdAt" | "updatedAt">): Promise<boolean> {
  try {
    const existingEventSnapshot = await db.collection("Activities")
      .where("name", "==", eventData.name)
      .get();

    if (!existingEventSnapshot.empty) {
      logger.log(`An event with the name "${eventData.name}" already exists.`);
      return false;
    }

    const eventDoc = {
      ...eventData,
      activityType: "event",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await db.collection("activities").add(eventDoc);
    return true;
  } catch (error) {
    logger.error("Error creating event:", error);
    return false;
  }
};

export const scrapeGoogleEvents = onSchedule("every 24 hours", async (event) => {

  const baseParams = {
    engine: "google_events",
    q: "Events in Humboldt County 2 days from now",
    hl: "en",
    gl: "us",
    location_requested: "Arcata, California, United States",
    api_key: "be404125603c75d7dcaf67c622c97a6baa0984bf13c263e9400566b1dc108a03"
  };

  let allSerpEvents: SerpEventResponse[] = [];

  try {
    const serpEventsJson = await getJson(baseParams);
    const serpEventsArr: SerpEventResponse[] = serpEventsJson["events_results"] || [];
    allSerpEvents = allSerpEvents.concat(serpEventsArr);
  } catch (error) {
    logger.error("Error fetching events: ", error);
  }

  const eventsToBeAdded: Omit<Event, "createdAt" | "updatedAt">[] = await createEvents(allSerpEvents);

  for (const e of eventsToBeAdded) {
    try {
      const success: boolean = await addEvent(e);
      logger.log('Event sent: ', success);
    } catch (error) {
      logger.error(`Error sending event ${e.name}: `, error);
    }

    // Delay between API calls
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  logger.log('Event scraping completed.');
  return Promise.resolve();
});
