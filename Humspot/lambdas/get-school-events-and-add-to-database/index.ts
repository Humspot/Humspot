/**
 * AWS Lambda function that runs daily.
 * 
 * It pulls the data from the HSU XML Event Data and stores events in the mySQL database.
 */

import { parseStringPromise } from 'xml2js';
import sanitizeHtml from 'sanitize-html';

interface LambdaResponse {
  statusCode: number;
  body: string;
  success: boolean;
};

interface HumspotEvent {
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

function convertToMySQLDate(formattedDate: string): string {
  // Must match the format "YYYY/MM/DD (Ddd)"
  const regexPattern = /^\d{4}\/\d{2}\/\d{2} \(\w{3}\)$/;
  if (!regexPattern.test(formattedDate)) {
    return '';
  }

  const datePart = formattedDate.split(' ')[0];
  const date = new Date(datePart);
  if (isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const mySQLDate = `${year}-${month}-${day}`;
  return mySQLDate;
}

exports.handler = async (event: any): Promise<LambdaResponse> => {
  try {

    const response = await fetch('https://25livepub.collegenet.com/calendars/HSU-featured-events.rss');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlData = await response.text();
    const result = await parseStringPromise(xmlData);
    const itemsList = result.rss.channel[0].item; // based on the structure of the XML document

    let eventsToBeAdded: HumspotEvent[] = [];
    for (let i = 0; i < itemsList.length; ++i) {
      const item = itemsList[i];
      const event: HumspotEvent = {
        name: item.title[0],
        description: sanitizeHtml(item.description[0], {
          allowedTags: [],
          allowedAttributes: {},
        }),
        addedByUserID: "HSUSchoolEventsScraper",
        websiteURL: item.link[0],
        date: convertToMySQLDate(item.category[0]),
        tags: ['HSU', 'School', 'Cal Poly Humboldt'],
        location: 'Cal Poly Humboldt',
        time: '',
        latitude: null,
        longitude: null,
        organizer: '',
        photoUrls: []
      };
      eventsToBeAdded.push(event);
    }

    if (!eventsToBeAdded || eventsToBeAdded.length <= 0) {
      throw new Error("No events found");
    }

    for (let i = 0; i < eventsToBeAdded.length; i++) {
      const e: HumspotEvent = eventsToBeAdded[i];
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

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Events added successfully', }),
      success: true
    };
  } catch (error) {
    console.error('Error fetching or uploading data:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error occurred' + error }),
      success: false
    };
  }
};

