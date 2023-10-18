/**
 * AWS lambda function to add an attraction to the mySQL database.
 * 
 * Returns the attractionID associated with the newly created event (assuming successful creation)
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

export type Attraction = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  websiteUrl: string;
  latitude: number;
  longitude: number;
  openTimes: string;
  tags: string[];
  photoUrls: string[];
};

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const attraction: Attraction = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has bene passed through the event
    if (!attraction|| typeof attraction.name !== 'string' || typeof attraction.description !== 'string' ||
      typeof attraction.location !== 'string' || typeof attraction.addedByUserID !== 'string' ||
      !Array.isArray(attraction.tags) || typeof attraction.openTimes !== 'string' || typeof attraction.websiteUrl !== 'string'
      || typeof attraction.latitude !== 'number' || typeof attraction.longitude !== 'number' || !Array.isArray(attraction.photoUrls)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing or incorrect fields in event data.', attraction: attraction,
        }),
      };
    }

    await conn.beginTransaction();

    // Check if the user is an admin or organizer
    const userID: string = attraction.addedByUserID;
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
            message: `User with ID ${userID} is not approved to add an event!`,
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
          message: `No user found with ID: ${userID}`,
        }),
      };
    }

    // Add to Activities table
    const activityID: string = crypto.randomBytes(16).toString('hex');
    query = 'INSERT INTO Activities (activityID, name, description, location, addedByUserID, activityType) VALUES (?, ?, ?, ?, ?, ?)';
    params = [activityID, attraction.name, attraction.description, attraction.location, attraction.addedByUserID, 'attraction'];
    await conn.query(query, params);

    // Add to Attractions table
    const attractionID: string = crypto.randomBytes(16).toString('hex');
    query = 'INSERT INTO Attractions (attractionID, activityID, websiteUrl, latitude, longitude, openTimes) VALUES (?, ?, ?, ?, ?, ?)';
    params = [attractionID, activityID, attraction.websiteUrl, attraction.latitude, attraction.longitude, attraction.openTimes];
    await conn.query(query, params);

    // Add to Tags and ActivityTags tables
    for (const tag of attraction.tags) {
      const tagID: string = crypto.randomBytes(16).toString('hex');
      await conn.query('INSERT IGNORE INTO Tags (tagID, tagName) VALUES (?, ?)', [tagID, tag]);
      await conn.query('INSERT INTO ActivityTags (activityID, tagID) VALUES (?, ?)', [activityID, tagID]);
    }

    // Add photoUrls to ActivityPhotos table
    for (const photoUrl of attraction.photoUrls) {
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
        message: 'Attraction added successfully.',
        attractionID: attractionID,
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
        message: 'Internal Server/mySQL Error',
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
