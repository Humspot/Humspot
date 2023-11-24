/**
 * AWS lambda function to retrieve whether a user has rated an attraction, and, if so, the rating value.
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
    const activityID = event.pathParameters && event.pathParameters["activityID"];
    const userID = event.pathParameters && event.pathParameters["userID"];

    if (!activityID || !userID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters" })
      };
    }
    const ratingQuery: string = `
      SELECT rating 
      FROM ActivityRatings 
      WHERE activityID = ? AND userID = ?;
    `;

    const [ratingRows]: any = await conn.execute(ratingQuery, [activityID, userID]);
    const userRating = ratingRows.length > 0 ? ratingRows[0].rating : null;
    const hasRated = ratingRows.length > 0;

    const ratingInfo = {
      rating: userRating,
      hasRated: hasRated
    };

    const resBody = { message: "Initial ratings query successful", success: true, ratingInfo: ratingInfo };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resBody),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    const resBody = { message: 'Internal Server Error, query execution error', success: false };
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resBody),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

