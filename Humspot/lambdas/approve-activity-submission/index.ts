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


async function sendEmail(submitterEmail: string, reason: string, activityType: string, activityName: string) {
  const mailOptions = {
    from: `app.tellU@gmail.com`,
    to: `${submitterEmail}`,
    subject: `Your ${activityType} submission to Humspot has been approved!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Your submission for ${activityName} was approved!</p>
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

type Event = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  organizer: string;
  tags: string[];
  photoUrls: string[];
  websiteURL: string | null;
};

type Attraction = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  websiteUrl: string;
  latitude: number;
  longitude: number;
  openTimes: string;
  tags: string[];
  photoUrls: string[];
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
  photoUrls: string | null; // comma delimited
  submissionDate: string | null;
  submissionID: string;
  tagNames: string | null; // comma delimited
  time: string | null;
  websiteURL: string | null;
};

type info = {
  adminUserID: string;
  submissionInfo: SubmissionInfo;
  reason: string;
};


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

    // Check if the user is an admin or organizer
    const userID: string = event.adminUserID;
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

    let tags: string[] = [];
    let photoUrls: string[] = [];

    if (event.submissionInfo.tagNames && event.submissionInfo.tagNames.length > 1) {
      tags = event.submissionInfo.tagNames.split(',');
      photoUrls = event.submissionInfo.photoUrls.split(',');
    }
    let res = null;
    if (event.submissionInfo.activityType === 'event') {
      const e: Event = {
        name: event.submissionInfo.name,
        description: event.submissionInfo.description,
        location: event.submissionInfo.location,
        addedByUserID: event.submissionInfo.addedByUserID,
        date: event.submissionInfo.date,
        time: event.submissionInfo.time,
        latitude: parseFloat(event.submissionInfo.latitude),
        longitude: parseFloat(event.submissionInfo.longitude),
        organizer: event.submissionInfo.organizer,
        tags: tags,
        photoUrls: photoUrls,
        websiteURL: event.submissionInfo.websiteURL
      };
      res = await fetch(
        process.env.AWS_API_GATEWAY_ADD_EVENT_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(e),
        }
      );
    } else if (event.submissionInfo.activityType === 'attraction') {
      const a: Attraction = {
        name: event.submissionInfo.name,
        description: event.submissionInfo.description,
        photoUrls: photoUrls,
        tags: tags,
        location: event.submissionInfo.location,
        latitude: parseFloat(event.submissionInfo.latitude),
        longitude: parseFloat(event.submissionInfo.longitude),
        openTimes: event.submissionInfo.openTimes,
        addedByUserID: event.submissionInfo.addedByUserID,
        websiteUrl: event.submissionInfo.websiteURL
      };
      res = await fetch(
        process.env.AWS_API_GATEWAY_ADD_ATTRACTION_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(a),
        }
      );
    } else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: 'Unable to approve custom activity (not an attraction or event)!',
          success: false
        }),
      };
    }

    query = `
      DELETE FROM Submissions
      WHERE submissionID = ?;
    `;
    params = [event.submissionInfo.submissionID];

    await conn.query(query, params);

    query = `
      SELECT email 
      FROM Users 
      WHERE userID = ?
    `;
    params = [event.submissionInfo.addedByUserID];

    const [rows]: any = await conn.query(query, params);
    const email: string = rows[0].email;

    await conn.commit();

    await sendEmail(email, event.reason, event.submissionInfo.activityType, event.submissionInfo.name);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Activity approved!',
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
        message: 'Internal Server/mySQL Error!', success: false
      }),
    };
  } finally {
    if (conn) {
      conn.release();
    }
  }
};


