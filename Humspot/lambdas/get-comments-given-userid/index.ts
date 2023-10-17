/**
 * AWS lambda function to retrieve the comment from the database given the page number and tag.
 * Each page pulls 10 comments from the database. 
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
        body: JSON.stringify({ message: "Invalid path parameters" })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 10;

    if (isNaN(pageNum) || pageNum < 1 || !userID) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Invalid path parameters' }),
      };
    }

    const query: string = `
      SELECT c.commentID, c.commentText, c.commentDate, a.activityID, a.name
      FROM Comments c
      JOIN Activities a ON c.activityID = a.activityID
      WHERE c.userID = ?
      ORDER BY c.commentDate DESC
      LIMIT 10 OFFSET ?;
    `;

    const [rows] = await conn.query(query, [userID, offset]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Success", comments: rows }),
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

