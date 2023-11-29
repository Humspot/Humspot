/**
 * AWS lambda function to approve an activity submission.
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


import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: "app.tellu@gmail.com",
    pass: "ryphaisxcgpcsvau"
  }
});


async function sendEmail(activityType: string, submitterEmail: string, reason: string) {
  const mailOptions = {
    from: `app.tellU@gmail.com`,
    to: `${submitterEmail}`,
    subject: `Your ${activityType} submission was just approved on Humspot!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Your ${activityType} submission was approved and is now being shown to the public on Humspot. Thanks for contributing to the app.</p>
        <p>Message from Admin: ${reason}</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email', error);
  }
};


type SubmissionInfo = {
  activityType: "event" | "attraction" | "custom"
  addedByUserID: string;
  date: string | null;
  description: string;
  latitude: string | null;
  longitude: string | null;
  location: string;
  name: string;
  openTimes: string | null;
  organizer: string;
  photoUrls: string | null;
  submissionDate: string | null;
  submissionID: string;
  tagNames: string | null;
  time: string | null;
  websiteURL: string | null;
};

type info = {
  approverID: string;
  submissionInfo: SubmissionInfo;
  reason: string;
}

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: info = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has been passed through the event
    if (!event) {
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

    // Check if the user is an admin
    const userID: string = event.approverID;
    let query: string = 'SELECT accountStatus, accountType FROM Users WHERE userID = ?';
    let params: (string | number)[] = [userID];
    const [result]: any[] = await conn.query(query, params);

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
            message: `User with ID ${userID} is not approved to give user organizer account type!`, success: false
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

    // get email from Users table given submissionInfo.addedByUserID
    query = `
      SELECT email
      FROM Users
      WHERE userID = ?
    `;
    params = [event.submissionInfo.addedByUserID];

    const [submitterEmail]: any[] = await conn.query(query, params);

    await conn.commit();

    await sendEmail(event.submissionInfo.activityType, submitterEmail[0], event.reason)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'User is now an organizer!',
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