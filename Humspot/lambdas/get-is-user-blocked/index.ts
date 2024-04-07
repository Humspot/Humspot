/**
 * AWS Lambda function to check if someone has another user blocked.
 */

import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

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

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event = JSON.parse(gatewayEvent.body || '{}');
    if (!event || typeof event.currentUserID !== 'string' || typeof event.otherUserID !== 'string' || !event.currentUserID || !event.otherUserID) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing userIDs', success: false, isUserBlocked: false
        }),
      };
    }

    const currentUserID: string = event.currentUserID;
    const otherUserID: string = event.otherUserID;

    const query: string = `
      SELECT COUNT(*) as count
      FROM BlockedUsers
      WHERE blockerUserID = ? AND blockedUserID = ?
    `;

    const [rows]: any = await pool.query(query, [currentUserID, otherUserID]);
    const count = rows[0] && rows[0]['count'] ? parseInt(rows[0]['count'], 10) : 0;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: count > 0 ? 'User is blocked' : 'User is not blocked',
        success: true,
        isUserBlocked: (count > 0)
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Internal Server/mySQL Error',
        success: false,
        isUserBlocked: false
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};