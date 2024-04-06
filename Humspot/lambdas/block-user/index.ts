/**
 * AWS Lambda function to remove a user's information from the database.
 */

import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

import * as mysql from 'mysql2/promise';
import * as crypto from 'crypto';

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
    // Ensure all data has been passed through the event
    if (!event || typeof event.blockerUserID !== 'string' || typeof event.blockedUserID !== 'string' || !event.blockerUserID || !event.blockedUserID) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing userIDs for blocker and blocked', success: false
        }),
      };
    }

    const blockerUserID: string = event.blockerUserID;
    const blockedUserID: string = event.blockedUserID;
    const blockID: string = crypto.randomBytes(12).toString('hex');

    const query: string = `
      INSERT INTO BlockedUsers (blockID, blockerUserID, blockedUserID) VALUES (?, ?, ?)
    `;

    await conn.execute(query, [blockID, blockerUserID, blockedUserID]);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'User blocked successfully',
        success: true
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
        success: false
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
