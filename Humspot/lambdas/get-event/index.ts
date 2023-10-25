/**
 * AWS lambda function to retrieve the event from the database given the eventID
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
  context.callbackWaitsForEmptyEventLoop = false;
  const conn = await pool.getConnection();
  try {
    const eventId: string | null = gatewayEvent.pathParameters?.eventId ?? null;
    if (!eventId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing eventID!',
        }),
      };
    }

    // Main event details query
    const queryEventDetails: string = `
      SELECT 
      Events.*, 
      Activities.*, 
      GROUP_CONCAT(DISTINCT Tags.tagName) as tags,
      GROUP_CONCAT(DISTINCT ActivityPhotos.photoURL) as photos
      FROM 
        Events
      INNER JOIN 
        Activities ON Events.activityID = Activities.activityID
      LEFT JOIN 
        ActivityTags ON Activities.activityID = ActivityTags.activityID
      LEFT JOIN 
        Tags ON ActivityTags.tagID = Tags.tagID
      LEFT JOIN 
        ActivityPhotos ON Activities.activityID = ActivityPhotos.activityID
      WHERE 
        Events.eventID = ?
      GROUP BY 
        Events.eventID;  
    `;

    const [eventRows]: any = await conn.execute(queryEventDetails, [eventId]);

    if (!eventRows || eventRows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Event with ID: ${eventId} not found` }),
      };
    }

    const event = eventRows[0];
    const activityId = event.activityID;

    // Comments query with User data for each comment
    const queryComments: string = `
      SELECT Comments.*, Users.username, Users.profilePicURL 
      FROM Comments 
      JOIN Users ON Comments.userID = Users.userID 
      WHERE Comments.activityID = ? 
      ORDER BY Comments.commentDate DESC;
    `;

    const [commentRows]: any = await conn.execute(queryComments, [activityId]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Event retrieved successfully',
        event: {
          ...event,
          comments: commentRows
        }
      }),
    };


  } catch (err) {
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