/**
 * AWS lambda function to retrieve the 20 most recent activity submissions submitted by the user.
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
  name: string;
  description: string;
  activityType: 'event' | 'attraction' | 'custom';
  submissionDate: string;
};

type GetActivitySubmissionsResponse = {
  success: boolean;
  message: string;
  submittedActivities: Submission[];
};

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
      const resBody: GetActivitySubmissionsResponse = { message: 'Invalid path parameters', success: false, submittedActivities: [] };
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
      if (accountStatus !== 'active') {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            "Access-Control-Allow-Methods": '*',
            "Access-Control-Allow-Origin": '*'
          },
          body: JSON.stringify({
            message: `User with ID ${userID} is not approved to view submissions`, success: false, submittedActivities: []
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
          message: `No user found with ID: ${userID}`, success: false, submittedActivities: []
        }),
      };
    }

    const query: string = `
      SELECT name, description, activityType, submissionID, submissionDate
      FROM Submissions
      WHERE addedByUserID = ?
      ORDER BY submissionDate DESC
      LIMIT 20 OFFSET ?;
    `;

    const [rows]: any = await conn.query(query, [userID, offset]);

    const resBody: GetActivitySubmissionsResponse = { message: "Submissions successful", success: true, submittedActivities: rows};
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resBody),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    const resBody: GetActivitySubmissionsResponse = { message: 'Internal Server Error, query execution error', success: false, submittedActivities: [] };
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
