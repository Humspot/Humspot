/**
 * AWS lambda function to retrieve a User's comments from the database given the page number and the userID.
 * Each page pulls 20 comments and/or RSVP'd events from the database. 
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
    const userID = event.pathParameters && event.pathParameters["userID"];

    if (!page || !userID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters", success: false, interactions: [] })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !userID) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid path parameters', success: false, interactions: [] }),
      };
    }

    const query: string = `
      SELECT * FROM (
        (
          SELECT 
              'comment' AS interactionType,
              c.commentID AS interactionID, 
              c.commentText AS interactionText, 
              c.commentDate AS interactionDate, 
              a.activityID, 
              a.name, 
              ap.photoUrl
          FROM 
              Comments c
          JOIN 
              Activities a ON c.activityID = a.activityID
          LEFT JOIN 
              (SELECT activityID, MIN(photoUrl) as photoUrl 
              FROM ActivityPhotos 
              GROUP BY activityID) ap ON a.activityID = ap.activityID
          WHERE 
              c.userID = ?
        )
        UNION ALL
        (
          SELECT 
              'rsvp' AS interactionType,
              r.RSVPID AS interactionID, 
              NULL AS interactionText, 
              r.rsvpDate AS interactionDate, 
              a.activityID, 
              a.name, 
              ap.photoUrl
          FROM 
              RSVP r
          JOIN 
              Activities a ON r.activityID = a.activityID
          LEFT JOIN 
              (SELECT activityID, MIN(photoUrl) as photoUrl 
              FROM ActivityPhotos 
              GROUP BY activityID) ap ON a.activityID = ap.activityID
          WHERE 
              r.userID = ?
        )
      ) as interactions
      ORDER BY 
          interactionDate DESC
      LIMIT 20 OFFSET ?;
    `;

    const [rows] = await conn.query(query, [userID, userID, offset]);


    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Successfully retrieved user interactions", success: true, interactions: rows }),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: false, interactions: [] }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
