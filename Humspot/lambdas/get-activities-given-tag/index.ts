/**
 * AWS lambda function to retrieve the activities from the database given the page number and tag.
 * Each page pulls 10 activities from the database. 
 * 
 * NOTE: The name of this function in AWS is get-events-given-tag, but it really pulls activities.
 * (As indicated by the folder name).
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
    const tag = event.pathParameters && event.pathParameters["tag"].toLowerCase();

    if (!page || !tag) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters", success: false })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !tag) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid path parameters', success: false }),
      };
    }

    const query: string = `
    SELECT 
    a.*,
    e.eventID,
    at.attractionID, at.openTimes,
    GROUP_CONCAT(ap.photoUrl ORDER BY ap.photoID) as photoUrls,
    CASE 
      WHEN a.activityType = 'event' AND e.date >= CURDATE() THEN 1
      WHEN a.activityType = 'attraction' THEN 2
      ELSE 3
    END as sortPriority,
    IF(a.activityType = 'event', e.date, NULL) as eventDate
  FROM Activities a
  LEFT JOIN ActivityTags atg ON a.activityID = atg.activityID
  LEFT JOIN Tags t ON atg.tagID = t.tagID
  LEFT JOIN Events e ON a.activityID = e.activityID AND a.activityType = 'event'
  LEFT JOIN Attractions at ON a.activityID = at.activityID AND a.activityType = 'attraction'
  LEFT JOIN ActivityPhotos ap ON a.activityID = ap.activityID
  WHERE LOWER(t.tagName) LIKE CONCAT('%', LOWER(?), '%')
  GROUP BY a.activityID
  ORDER BY 
    sortPriority ASC,
    IF(a.activityType = 'event', e.date, a.avgRating) DESC,
    a.name ASC
  LIMIT 10 OFFSET ?;
  
    `;
    const [rows] = await conn.query(query, [tag, offset]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Success", activities: rows, success: true }),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: true }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

