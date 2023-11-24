/**
 * AWS lambda function to add a rating to an Activity (1 to 5 stars.)
 */

import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import * as mysql from 'mysql2/promise';


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

export type RatingInfo = {
  userID: string;
  rating: number;
  activityID: string;
}

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: RatingInfo = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has bene passed through the event
    if (!event || typeof event.userID !== 'string'
      || typeof event.rating !== 'number'
      || typeof event.activityID !== 'string') {
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

    // Check if the user is an admin or organizer
    const userID: string = event.userID;
    let query: string = 'SELECT accountStatus FROM Users WHERE userID = ?';
    let params: (string | number)[] = [userID];
    const [result]: any[] = await conn.query(query, params);

    if (result.length > 0) { // The user exists, and we have the accountStatus
      const accountStatus: string = result[0].accountStatus;
      if (accountStatus !== 'active') {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            "Access-Control-Allow-Methods": '*',
            "Access-Control-Allow-Origin": '*'
          },
          body: JSON.stringify({
            message: `User with ID ${userID} is not approved to add a rating!`, success: false
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
          message: `No user found with ID: ${userID}`, success: false
        }),
      };
    }

    // Add to ActivityRatings table
    query = `
      INSERT INTO ActivityRatings (userID, activityID, rating, dateRated)
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        rating = VALUES(rating),
        dateRated = NOW();
    `;
    params = [event.userID, event.activityID, event.rating];

    await conn.query(query, params);

    // Calculate the new average rating
    const avgRatingQuery = `
      SELECT AVG(rating) as avgRating
      FROM ActivityRatings
      WHERE activityID = ?;
    `;
    const [avgResults]: any[] = await conn.query(avgRatingQuery, [event.activityID]);
    const avgRating = avgResults[0].avgRating;

    // Update the avgRating in Activities table
    const updateAvgRatingQuery = `
      UPDATE Activities
      SET avgRating = ?
      WHERE activityID = ?;
    `;
    await conn.query(updateAvgRatingQuery, [avgRating, event.activityID]);

    await conn.commit();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Rating added successfully.',
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
