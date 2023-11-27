/**
 * AWS lambda function to retrieve info from the Submissions table for a specific entry.
 * This function differs from get-pending-activity-submissions because it retrieves ALL info (SELECT *), along with tags and photos.
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

type GetPendingActivitySubmissionsResponse = {
  success: boolean;
  message: string;
  submissionInfo: any;
};

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {
    const userID = event.pathParameters && event.pathParameters["userID"];
    const submissionID = event.pathParameters && event.pathParameters["submissionID"];
    if (!submissionID || !userID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid path parameters!" })
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
            message: `User with ID ${userID} is not approved to view submissions info`, success: false, submissionInfo: []
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
      SELECT 
        s.*,
        GROUP_CONCAT(DISTINCT sp.photoUrl SEPARATOR ', ') AS photoUrls,
        GROUP_CONCAT(DISTINCT st.tagName SEPARATOR ', ') AS tagNames
      FROM 
        Submissions s
      LEFT JOIN 
        SubmissionPhotos sp ON s.submissionID = sp.submissionID
      LEFT JOIN 
        SubmissionTags st ON s.submissionID = st.submissionID
      WHERE 
        s.submissionID = ?
      GROUP BY 
        s.submissionID;
    `;

    const [rows]: any = await conn.query(query, [submissionID]);

    const resBody: GetPendingActivitySubmissionsResponse = { message: "Pending submissions query successful", success: true, submissionInfo: rows[0] };
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resBody),
    };

  } catch (error) {
    console.error('Query execution error:', error);
    const resBody: GetPendingActivitySubmissionsResponse = { message: 'Internal Server Error, query execution error', success: false, submissionInfo: [] };
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
