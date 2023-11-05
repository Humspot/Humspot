/**
 * AWS lambda function to add an activity to a User's RSVP list.
 * 
 * Returns the RSVPID associated with the newly created RSVP row (assuming successful creation)
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

export type RSVPParams = {
  userID: string;
  activityID: string;
  rsvpDate: string;
};

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: RSVPParams = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has bene passed through the event
    if (!event || typeof event.userID !== 'string' || typeof event.activityID !== 'string' || typeof event.rsvpDate !== 'string') {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing or incorrect fields in event data.', success: false
        }),
      };
    }

    await conn.beginTransaction();

    // Check if the user has already RSVP this activity
    let checkQuery = 'SELECT RSVPID FROM RSVP WHERE userID = ? AND activityID = ?';
    const [rows]: any = await conn.query(checkQuery, [event.userID, event.activityID]);

    if (rows.length > 0) {
      // Remove from RSVP table
      let deleteQuery = 'DELETE FROM RSVP WHERE userID = ? AND activityID = ?';
      await conn.query(deleteQuery, [event.userID, event.activityID]);
      await conn.commit();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Removed from RSVP list',
          success: true,
          removed: true
        }),
      };
    }

    // Add activity to RSVP table
    const RSVPID: string = crypto.randomBytes(16).toString('hex');
    let query: string = 'INSERT INTO RSVP (RSVPID, userID, activityID, rsvpDate) VALUES (?, ?, ?, ?)';
    let params: string[] = [RSVPID, event.userID, event.activityID, event.rsvpDate];
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
        message: 'Successfully RSVP\'d for activity.',
        RSVPID: RSVPID,
        success: true
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
        message: 'Internal Server/mySQL Error', success: false
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

