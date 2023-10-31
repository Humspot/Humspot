/**
 * AWS Lambda function which returns the information about an Activity (Event or Attraction)
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
    const activityId: string | null = gatewayEvent.pathParameters?.activityId ?? null;
    if (!activityId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing activityID!',
          success: false
        }),
      };
    }

    // Main activity details query (conditional CASE WHEN handles both Events and Attractions)
    const query: string = `
      SELECT 
      a.name, 
      a.description, 
      a.location, 
      a.activityType, 
      a.websiteURL,
      
      CASE WHEN a.activityType = 'Event' THEN e.date ELSE NULL END as date,
      CASE WHEN a.activityType = 'Event' THEN e.time ELSE NULL END as time,
      CASE WHEN a.activityType = 'Event' THEN e.latitude ELSE at.latitude END as latitude,
      CASE WHEN a.activityType = 'Event' THEN e.longitude ELSE at.longitude END as longitude,
      CASE WHEN a.activityType = 'Event' THEN e.organizer ELSE NULL END as organizer,
      CASE WHEN a.activityType = 'Attraction' THEN at.openTimes ELSE NULL END as openTimes,
      GROUP_CONCAT(t.tagName) as tags,
      GROUP_CONCAT(ap.photoUrl) as photoUrls

      FROM Activities a

      LEFT JOIN Events e ON a.activityId = e.activityID AND a.activityType = 'Event'
      LEFT JOIN Attractions at ON a.activityId = at.activityID AND a.activityType = 'Attraction'
      LEFT JOIN ActivityTags atg ON a.activityId = atg.activityID
      LEFT JOIN Tags t ON atg.tagID = t.tagID
      LEFT JOIN ActivityPhotos ap ON a.activityId = ap.activityID

      WHERE a.activityId = ?
      GROUP BY a.activityId;
    `;

    const [activityRows]: any = await conn.execute(query, [activityId]);

    if (!activityRows || activityRows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Activity with ID: ${activityId} not found`, success: false }),
      };
    }

    const activity = activityRows[0];

    // Comments query with User data for each comment
    const queryComments: string = `
      SELECT Comments.*, Users.username, Users.profilePicURL 
      FROM Comments 
      JOIN Users ON Comments.userID = Users.userID 
      WHERE Comments.activityID = ? 
      ORDER BY Comments.commentDate DESC
      LIMIT 10;
    `;

    const [commentRows]: any = await conn.execute(queryComments, [activityId]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Activity retrieved successfully',
        activity: {
          ...activity,
          comments: commentRows
        },
        success: true
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
        success: false
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};


