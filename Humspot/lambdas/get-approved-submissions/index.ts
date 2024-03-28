/**
 * AWS lambda function to retrieve the approved activities submitted by a user given the page number and tag.
 * Each page pulls 10 activities from the database. 
 * 
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
    const page: string = event.pathParameters && event.pathParameters["page"];
    const userID: string = event.pathParameters && event.pathParameters["userID"];

    if (!page || !userID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters", success: false })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !userID) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid path parameters', success: false, submissions: [] }),
      };
    }

    const query: string = `
    SELECT 
      A.activityID,
      A.name,
      A.description,
      COALESCE(AP.photoUrl, '') AS image_url
    FROM 
        Activities A
    LEFT JOIN (
        SELECT 
            activityID, 
            photoUrl
        FROM 
            ActivityPhotos
        GROUP BY 
            activityID
    ) AP ON A.activityID = AP.activityID
    WHERE 
        A.addedByUserID = ?
        LIMIT 10 OFFSET ?;
    `;
    const [rows] = await conn.query(query, [userID, offset]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Success", submissions: rows, success: true }),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: false, submissions: [] }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
