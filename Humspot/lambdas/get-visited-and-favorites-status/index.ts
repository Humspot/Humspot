/**
 * AWS lambda function to retrieve whether a user has visited or favorited or RSVP'd for an activity.
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

    const userID = event.pathParameters && event.pathParameters["userId"];
    const activityID = event.pathParameters && event.pathParameters["activityId"];

    // Ensure all data has bene passed through the gateway event
    if (!userID || !activityID) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing or invalid path params.', success: false, visited: null, favorited: null, rsvp: null
        }),
      };
    }


    // Query to check if the user has favorited the activity
    const queryFavorited: string = `
      SELECT EXISTS(SELECT * FROM Favorites WHERE userID = ? AND activityID = ?) as favorited;
    `;

    const [favoritedRows]: any = await conn.execute(queryFavorited, [userID, activityID]);

    // Query to check if the user has visited the activity
    const queryVisited: string = `
      SELECT EXISTS(SELECT * FROM Visited WHERE userID = ? AND activityID = ?) as visited;
    `;

    const [visitedRows]: any = await conn.execute(queryVisited, [userID, activityID]);

    // Query to check the user's RSVP status
    const queryRSVP: string = `
      SELECT EXISTS(SELECT * FROM RSVP WHERE userID = ? AND activityID = ?) as RSVP;
    `

    const [rsvpRows]: any = await conn.execute(queryRSVP, [userID, activityID]);

    const favorited: boolean = favoritedRows[0]?.favorited === 1;
    const visited: boolean = visitedRows[0]?.visited === 1;
    const rsvp: boolean = rsvpRows[0]?.favorited === 1;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Successfully got favorited and visited status', success: true, visited: visited, favorited: favorited, rsvp: rsvp }),
    }

  } catch (error) {
    console.error('Query execution error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal Server Error, query execution error', success: false, visited: null, favorited: null, rsvp: null }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};



