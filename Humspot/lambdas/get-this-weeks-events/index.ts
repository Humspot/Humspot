/**
 * AWS lambda function to retrieve events that are happening this week (within the next 7 days, inclusive).
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

function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  let month = (today.getMonth() + 1).toString();
  let day = today.getDate().toString();

  month = month.length < 2 ? '0' + month : month;
  day = day.length < 2 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

function getDateDaysFromNow(days: number) {
  const date = new Date(); // Current date
  date.setDate(date.getDate() + days); // Adding the specified number of days

  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString(); // Months are 0-indexed
  let day = date.getDate().toString();

  month = month.length < 2 ? '0' + month : month;
  day = day.length < 2 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {

    const date1: string = getCurrentDate();
    const date2: string = getDateDaysFromNow(7);

    // Query events that are happening between the two dates 
    const query = `
      SELECT e.*, a.name, a.description, a.location, a.websiteURL,
      (SELECT ap.photoUrl 
        FROM ActivityPhotos ap 
        WHERE a.activityID = ap.activityID 
        ORDER BY ap.photoID LIMIT 1) AS photoUrl,
      GROUP_CONCAT(DISTINCT t.tagName) AS tags
      FROM Events e
      INNER JOIN Activities a ON e.activityID = a.activityID
      LEFT JOIN ActivityPhotos ap ON a.activityID = ap.activityID
      LEFT JOIN ActivityTags at ON a.activityID = at.activityID
      LEFT JOIN Tags t ON at.tagID = t.tagID
      WHERE e.date BETWEEN ? AND ? AND e.latitude IS NOT NULL AND e.longitude IS NOT NULL
      GROUP BY e.eventID, a.name, a.description, a.location, a.websiteURL
      ORDER BY e.date;
    `;
    const [rows]: any = await conn.query(query, [date1, date2]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Successfully got this week\'s events', success: true, events: rows }),
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