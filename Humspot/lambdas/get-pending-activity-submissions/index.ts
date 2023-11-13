/**
 * AWS lambda function to retrieve the 20 most recent pending activities from the Submissions table.
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

type Submission = {
  submissionID: string;
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  activityType: 'event' | 'attraction' | 'custom';
  websiteURL: string | null;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  organizer: string;
  tags: string | null;
};

type GetPendingActivitySubmissionsResponse = {
  success: boolean;
  message: string;
  pendingSubmissions: Submission[];
}


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
        body: JSON.stringify({ message: "Invalid path parameters!" })
      };
    }
    const pageNum: number = Number(page);
    const offset: number = (pageNum - 1) * 20;

    if (isNaN(pageNum) || pageNum < 1 || !userID) {
      const resBody: GetPendingActivitySubmissionsResponse = { message: 'Invalid path parameters', success: false, pendingSubmissions: [] };
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resBody),
      };
    }

    let userStatusQuery: string = 'SELECT accountStatus, accountType FROM Users WHERE userID = ?';
    const [result]: any[] = await conn.query(userStatusQuery, userID);

    if (result.length > 0) { // The user exists, and we have the accountStatus
      const accountStatus: string = result[0].accountStatus;
      const accountType: string = result[0].accountType;
      if (accountStatus !== 'active' || accountType !== 'admin') {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            "Access-Control-Allow-Methods": '*',
            "Access-Control-Allow-Origin": '*'
          },
          body: JSON.stringify({
            message: `User with ID ${userID} is not approved to view submissions`, success: false, pendingSubmissions: []
          }),
        };
      }
    } else {  // No user found with the provided userID.
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: `No user found with ID: ${userID}`, success: false, pendingSubmissions: []
        }),
      };
    }

    const query: string = `
      SELECT * FROM Submissions
      LIMIT 20 OFFSET ?;
    `;

    const [rows]: any = await conn.query(query, [offset]);

    const resBody: GetPendingActivitySubmissionsResponse = { message: "Favorites query successful", success: true, pendingSubmissions: rows};
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resBody),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    const resBody: GetPendingActivitySubmissionsResponse = { message: 'Internal Server Error, query execution error', success: false, pendingSubmissions: [] };
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
