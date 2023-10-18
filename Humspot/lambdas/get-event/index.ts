/**
 * AWS lambda function to retrieve the event from the database given the eventID
 */

import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

import * as mysql from 'mysql2/promise';

const pool: mysql.Pool = mysql.createPool({
  host: process.env.AWS_RDS_HOSTNAME,
  user: process.env.AWS_RDS_USER,
  password: process.env.AWS_RDS_PASSWORD,
  database: process.env.AWS_RDS_DATABASE_NAME,
  port: Number(process.env.AWS_RDS_PORT),
  connectionLimit: 1000,
  connectTimeout: (60 * 60 * 1000),
  debug: true
});

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {
    const eventId: string | null = gatewayEvent.pathParameters?.eventId ?? null;
    if (!eventId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing eventID!',
        }),
      };
    }

    const query: string = `
      SELECT Events.*, Activities.*, GROUP_CONCAT(Tags.tagName) as tags FROM Events
      INNER JOIN Activities ON Events.activityID = Activities.activityID
      INNER JOIN ActivityTags ON Activities.activityID = ActivityTags.activityID
      INNER JOIN Tags ON ActivityTags.tagID = Tags.tagID
      WHERE Events.eventID = ?
      GROUP BY Events.eventID;
    `;

    const [rows]: any = await conn.execute(query, [eventId]);

    if (!rows || rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Event with ID: ${eventId} not found` }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event retrieved successfully', event: rows[0] }),
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