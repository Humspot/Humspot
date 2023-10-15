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
  lat: number;
  lng: number;
  organizer: string;
  tags: string[];
};

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: Event = JSON.parse(gatewayEvent.body || '{}');

    if (!event || typeof event.name !== 'string' || typeof event.description !== 'string' ||
      typeof event.location !== 'string' || typeof event.addedByUserID !== 'string' ||
      !Array.isArray(event.tags) || typeof event.lat !== 'number' || typeof event.lng !== 'number') {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing or incorrect fields in event data.',
        }),
      };
    }

    await conn.beginTransaction();

    const activityID: string = crypto.randomBytes(16).toString('hex');
    let query: string = 'INSERT INTO Activities (activityID, name, description, location, addedByUserID, activityType) VALUES (?, ?, ?, ?, ?, ?)';
    let params: (string | number)[] = [activityID, event.name, event.description, event.location, event.addedByUserID, 'event'];
    await conn.query(query, params);


    const eventID: string = crypto.randomBytes(16).toString('hex');
    query = 'INSERT INTO Events (eventID, activityID, date, time, latitude, longitude, organizer) VALUES (?, ?, ?, ?, ?, ?, ?)';
    params = [eventID, activityID, event.date, event.time, event.lat, event.lng, event.organizer];
    await conn.query(query, params);

    console.log("\nAFTER SECOND QUERY\n");

    for (const tag of event.tags) {
      const tagID: string = crypto.randomBytes(16).toString('hex');
      await conn.query('INSERT IGNORE INTO Tags (tagID, tagName) VALUES (?, ?)', [tagID, tag]);
      await conn.query('INSERT INTO ActivityTags (activityID, tagID) VALUES (?, ?)', [activityID, tagID]);
    }

    console.log("\nAfter for LOOP\n");

    await conn.commit();

    console.log("\nCOMITTN\n");

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

