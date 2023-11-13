/**
 * AWS lambda function to retrieve events that are happening between the specified dates (inclusive). 
 */

import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

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

function isValidDate(dateString: string) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateString.match(regex) === null) {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date;
}

function areValidDates(date1: string, date2: string) {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return false;
  }
  return new Date(date1) <= new Date(date2);
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {

    const date1: string = event.pathParameters && event.pathParameters["date1"];
    const date2: string = event.pathParameters && event.pathParameters["date2"];

    // Validate passed dates
    if (!areValidDates(date1, date2)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({ message: 'Invalid date format or logical error in dates', success: false, events: [] }),
      };
    }

    // Ensure all data has bene passed through the gateway event
    if (!date1 || !date2) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing or invalid path params.', success: false, events: []
        }),
      };
    }

    // Query events that are happening between the two dates 
    const query = `
      SELECT e.*, a.name, a.description, a.location, a.activityType, a.websiteURL
      FROM Events e
      INNER JOIN Activities a ON e.activityID = a.activityID
      WHERE e.date BETWEEN ? AND ?
    `;
    const [rows]: any = await conn.query(query, [date1, date2]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Successfully got favorited and visited status', success: true, events: rows }),
    }

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: false, events: [] }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

