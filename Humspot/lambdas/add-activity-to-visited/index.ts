/**
 * AWS lambda function to add an activity to a User's visited list.
 * 
 * Returns the visitedID associated with the newly created visit row (assuming successful creation)
 */

import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

import * as crypto from 'crypto';

const pool = mysql.createPool({
  host: process.env.AWS_RDS_HOSTNAME,
  user: process.env.AWS_RDS_USER,
  password: process.env.AWS_RDS_PASSWORD,
  database: process.env.AWS_RDS_DATABASE_NAME,
  port: Number(process.env.AWS_RDS_PORT),
  connectionLimit: 1000,
  connectTimeout: (60 * 60 * 1000),
  debug: true
});

export type VisitedParams = {
  userID: string;
  activityID: string;
  visitDate: string;
};

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: VisitedParams = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has bene passed through the event
    if (!event || typeof event.userID !== 'string' || typeof event.activityID !== 'string' || typeof event.visitDate !== 'string') {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing or incorrect fields in event data.', gatewayEvent: event,
        }),
      };
    }

    await conn.beginTransaction();

    // Add activity to Visited table
    const visitedID: string = crypto.randomBytes(16).toString('hex');
    let query: string = 'INSERT INTO Visited (visitedID, userID, activityID, visitDate) VALUES (?, ?, ?, ?)';
    let params: string[] = [visitedID, event.userID, event.activityID, event.visitDate];
    await conn.query(query, params);

    await conn.commit();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Visit added successfully.',
        visitedID: visitedID,
      }),
    };

  } catch (err) {
    if (conn) {
      await conn.rollback();
    }

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Internal Server/mySQL Error',
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};