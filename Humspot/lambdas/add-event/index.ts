/**
 * AWS lambda function to add an event to the mySQL database.
 * 
 * Returns the eventID associated with the newly created event (assuming successful creation)
 */

import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

import * as crypto from 'crypto';

const pool = mysql.createPool({
  host: process.env.AWS_RDS_HOSTNAME,
  user: process.env.AWS_RDS_USER,
  password: process.env.AWS_RDS_PASSWORD,
  database: process.env.AWS_RDS_DATABASE_NAME,
  port: Number(process.env.AWS_RDS_PORT),
  connectionLimit: 1000,
  connectTimeout: (60 * 60 * 1000),
  debug: true
});

export type Event = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  organizer: string;
  tags: string[];
  photoUrls: string[];
  websiteURL: string | null;
};

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: Event = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has bene passed through the event
    if (!event || typeof event.name !== 'string' || typeof event.description !== 'string' ||
      typeof event.location !== 'string' || typeof event.addedByUserID !== 'string' ||
      !Array.isArray(event.tags) || !Array.isArray(event.photoUrls)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing or incorrect fields in event data.', success: false
        }),
      };
    }

    await conn.beginTransaction();

    // Check if the user is an admin or organizer
    const userID: string = event.addedByUserID;
    let query: string = 'SELECT accountType FROM Users WHERE userID = ?';
    let params: (string | number)[] = [userID];
    const [result]: any[] = await conn.query(query, params);

    if (result.length > 0) { // The user exists, and we have the accountType.
      const accountType: string = result[0].accountType;
      if (accountType !== 'admin' && accountType !== 'organizer') {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            "Access-Control-Allow-Methods": '*',
            "Access-Control-Allow-Origin": '*'
          },
          body: JSON.stringify({
            message: `User with ID ${userID} is not approved to add an event!`, success: false
          }),
        };
      }
    } else {  // No user found with the provided userID.
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: `No user found with ID: ${userID}`, success: false
        }),
      };
    }

    // Check if an event with the same name already exists
    query = 'SELECT * FROM Activities WHERE name = ?';
    params = [event.name];
    const [existingEvent]: any[] = await conn.query(query, params);

    if (existingEvent.length > 0) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: `An event with the name "${event.name}" already exists.`, success: false
        }),
      };
    }

    // Add to Activities table
    const activityID: string = crypto.randomBytes(16).toString('hex');
    query = 'INSERT INTO Activities (activityID, name, description, location, addedByUserID, activityType, websiteURL) VALUES (?, ?, ?, ?, ?, ?, ?)';
    params = [activityID, event.name, event.description, event.location, event.addedByUserID, 'event', event.websiteURL];
    await conn.query(query, params);

    // Add to Events table
    const eventID: string = crypto.randomBytes(16).toString('hex');
    query = 'INSERT INTO Events (eventID, activityID, date, time, latitude, longitude, organizer) VALUES (?, ?, ?, ?, ?, ?, ?)';
    params = [eventID, activityID, event.date, event.time, event.latitude, event.longitude, event.organizer];
    await conn.query(query, params);

    // Add to Tags and ActivityTags tables
    for (const tag of event.tags) {
      if (tag.length <= 0) continue;
      const tagID: string = crypto.randomBytes(16).toString('hex');
      await conn.query('INSERT IGNORE INTO Tags (tagID, tagName) VALUES (?, ?)', [tagID, tag]);
      await conn.query('INSERT INTO ActivityTags (activityID, tagID) VALUES (?, ?)', [activityID, tagID]);
    }

    // Add photoUrls to ActivityPhotos table
    for (const photoUrl of event.photoUrls) {
      const photoID: string = crypto.randomBytes(16).toString('hex');
      const query: string = 'INSERT INTO ActivityPhotos (photoID, activityID, photoUrl) VALUES (?, ?, ?)';
      const params: string[] = [photoID, activityID, photoUrl];
      await conn.query(query, params);
    }

    await conn.commit();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Event added successfully.',
        eventID: eventID,
        success: true
      }),
    };

  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Internal Server/mySQL Error', success: false
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

