/**
 * AWS lambda function that submits a request to the admin for a user to become a coordinator (event organizer).
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

export type UserSubmissionData = {
  userID: string;
  name: string;
  email: string;
  description: string;
};


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


async function sendEmail(e: UserSubmissionData) {

  const mailOptions = {
    from: `app.tellU@gmail.com`,
    to: `dy45@humboldt.edu,np157@humboldt.edu,sr407@humboldt.edu,dvn8@humboldt.edu,app.tellu@gmail.com`,
    subject: 'Someone has requested to be an event organizer for Humspot.',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: black;">Request Info</h1>
        <p><strong>User's Name:</strong> ${e.name}</p>
        <p><strong>Description:</strong> ${e.description}</p>
        <p><strong>userID</strong> ${e.userID}</p>
        <p><strong>Email:</strong> ${e.email}</p>
      </div>
    `
  };

  const mailOptionsToSubmittedUser = {
    from: `app.tellU@gmail.com`,
    to: e.email,
    subject: 'You have requested to be an event organizer for Humspot.',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: black;">Submission Sent</h1>
        <p>Look out for an email once you have been granted approval to become an event organizer.</p>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    const other = await transporter.sendMail(mailOptionsToSubmittedUser);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email', error);
  }
};

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: UserSubmissionData = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has bene passed through the event
    if (!event || typeof event.name !== 'string' || typeof event.name !== 'string') {
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

    let query: string = `
      INSERT INTO OrganizerSubmissions (submissionID, name, description, userID, email)
      VALUES (?, ?, ?, ?, ?);
    `;
    const submissionID: string = crypto.randomBytes(12).toString('hex');
    let params = [submissionID, event.name, event.description, event.userID, event.email];

    await conn.query(query, params);

    const updateQuery = `
    UPDATE Users 
    SET requestForCoordinatorSubmitted = 1 
    WHERE userID = ?;
  `;

    await conn.query(updateQuery, [event.userID]);

    await conn.commit();

    await sendEmail(event);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Methods": '*',
        "Access-Control-Allow-Origin": '*'
      },
      body: JSON.stringify({
        message: 'Request for event organizer sent!',
        submissionID: submissionID,
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
