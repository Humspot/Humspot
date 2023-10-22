/**
 * AWS lambda function that updates a user's profile info
 * 
 * This includes profilePicUrl, 
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

type HumspotUser = {
  userID: string;
  email: string | null;
  profilePicUrl: string;
  username: string | null;
  accountType: 'user' | 'admin' | 'organizer' | 'guest';
  accountStatus: 'active' | 'restricted';
  authProvider: 'google' | 'custom'
  dateCreated: string | Date;
}

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const connection = await pool.getConnection();
  try {
    const requestData = JSON.parse(event.body || '{}');

    if (!requestData || requestData.username === undefined || requestData.profilePicUrl === undefined || requestData.bio === undefined) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing fields in user data!! All three fields (username, profilePicUrl, bio) are required.',
          success: false
        }),
      };
    }

    const { userID, username, profilePicUrl, bio } = requestData;
    let updateFields = [];
    let values = [];

    if (username !== '') {
      updateFields.push('`username` = ?');
      values.push(username);
    }
    if (profilePicUrl !== '') {
      updateFields.push('`profilePicURL` = ?');
      values.push(profilePicUrl);
    }
    if (bio !== '') {
      updateFields.push('`bio` = ?');
      values.push(bio);
    }

    if (updateFields.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Empty fields. Nothing to update.',
          success: false
        }),
      };
    }

    const sql = `UPDATE Users SET ${updateFields.join(', ')} WHERE userID = ?`;
    values.push(userID);

    await connection.execute(sql, values);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'User updated successfully',
        success: true
      }),
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: `Server Error: ${error.message}`,
        success: false
      }),
    };
  } finally {
    connection.release();
  }
};
