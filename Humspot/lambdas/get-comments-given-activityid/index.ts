/**
 * AWS lambda function to retrieve an Activity's (event or attraction) comments from the database given the page number.
 * Each page pulls 10 comments at a time.
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
    const activityID: string = event.pathParameters && event.pathParameters["activityID"];

    if (!page || !activityID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters" })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !activityID || offset < 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid path parameters' }),
      };
    }

    const queryComments: string = `
      SELECT Comments.*, Users.username, Users.profilePicURL 
      FROM Comments 
      JOIN Users ON Comments.userID = Users.userID 
      WHERE Comments.activityID = ?
      ORDER BY Comments.commentDate DESC
      LIMIT 10 
      OFFSET ?;
    `;

    const [commentRows] = await conn.execute(queryComments, [activityID as string, offset.toString()]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Success", comments: commentRows, success: true }),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: false }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};