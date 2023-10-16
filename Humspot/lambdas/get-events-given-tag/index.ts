/**
 * AWS lambda function to retrieve the events from the database given the page number and tag.
 * Each page pulls 10 events from the database. 
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

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {
    const page = event.pathParameters && event.pathParameters["page"];
    const tag = event.pathParameters && event.pathParameters["tag"];

    if (!page || !tag) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters" })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !tag) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid path parameters' }),
      };
    }

    const query: string = `
      SELECT *
      FROM Events
      JOIN Activities ON Events.activityID = Activities.activityID
      JOIN ActivityTags ON Activities.activityID = ActivityTags.activityID
      JOIN Tags ON ActivityTags.tagID = Tags.tagID
      WHERE Tags.tagName = ?
      ORDER BY Events.date DESC, Events.time DESC
      LIMIT 10 OFFSET ?;
    `;
    const [rows] = await conn.query(query, [tag, offset]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Success", events: rows }),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error' }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};