/**
 * AWS lambda function which is called after a user logs in.
 * 
 * If it is their first time, this function will create a new row in the mySQL Users table.
 * 
 * If the user had logged in before, this function will return an object containing the user's 
 * information from the mySQL Users table.
 * 
 * NOTE: The name of this function in AWS is create-user, so use this when updating the function!
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

type HumspotUser = {
  userID: string;
  email: string | null;
  profilePicURL: string | null;
  username: string | null;
  accountType: 'user' | 'admin' | 'organizer' | 'guest';
  accountStatus: 'active' | 'restricted';
  authProvider: 'google' | 'custom'
  dateCreated: string | Date;
}

// Get current date in 'YYYY-MM-DD' format
const getCurrentDate = (): string => {
  const date = new Date();
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}


export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const connection = await pool.getConnection();
  try {
    const requestData = JSON.parse(event.body || '{}');

    if (!requestData || !requestData.username || !requestData.email || !requestData.authProvider || !requestData.accountType || !requestData.accountStatus) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Missing fields in user data!!',
        }),
      };
    }


    const selectUserQuery = 'SELECT * FROM Users WHERE email = ?';
    const [userResult]: any = await connection.query(selectUserQuery, [requestData.email]);

    if (!userResult || userResult.length > 0) {
      const notificationsToken = "notificationsToken" in requestData ? requestData.notificationsToken : '';
      if (notificationsToken) {
        const query = `
          UPDATE Users 
          SET notificationsToken = ? 
          WHERE userID = ?;
        `;
        const parameters = [notificationsToken, userResult[0].userID];
        await connection.query(query, parameters);
      }
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: `User ${requestData.email} already exists! Returning user info...`,
          user: userResult[0]
        }),
      };
    }

    const currentDate: string = getCurrentDate();
    const userID: string = crypto.randomBytes(12).toString('hex');

    const query = `
      INSERT INTO Users (userID, username, email, authProvider, accountType, accountStatus, profilePicURL, dateCreated, notificationsToken) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const notificationsToken = requestData.notificationsToken || null;
    const parameters = [userID, requestData.username, requestData.email, requestData.authProvider, requestData.accountType, 'active', requestData.profilePicURL || null, currentDate, notificationsToken];

    await connection.query(query, parameters);

    const humspotUser: HumspotUser = {
      userID: userID,
      username: requestData.username,
      email: requestData.email,
      authProvider: requestData.authProvider,
      accountType: requestData.accountType,
      accountStatus: 'active',
      profilePicURL: requestData.profilePicURL || null,
      dateCreated: currentDate,
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'User created successfully',
        user: humspotUser
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
        message: `Server Error: ${JSON.stringify(error.message)}`,
      }),
    };
  } finally {
    connection.release();
  }
};

