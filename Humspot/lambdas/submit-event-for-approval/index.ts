/**
 * AWS lambda function that adds a pending event submission to the Submissions table. 
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

export type Event = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  latitude: number | null;
  longitude: number | null;
  organizer: string;
  tags: string[];
  photoUrls: string[];
  websiteURL: string | null;
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


async function sendEmail(e: Event) {
  // Constructing the tags and photo URLs as HTML strings
  const tagsHtml = e.tags.map(tag => `<span style="padding: 5px; margin-right: 5px; background-color: #1eba4e; color: white; border-radius: 5px;">${tag}</span>`).join('');
  const photosHtml = e.photoUrls.map(url => `<img src="${url}" alt="Event Photo" style="max-width: 100%; height: auto; margin-top: 10px;">`).join('');

  const mailOptions = {
    from: `app.tellU@gmail.com`,
    to: `dev@humspotapp.com`,
    subject: 'An event for Humspot was submitted and is now pending approval from an admin.',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: black;">Event Info</h1>
        <p><strong>Event Name:</strong> ${e.name}</p>
        <p><strong>Description:</strong> ${e.description}</p>
        <p><strong>Location:</strong> ${e.location}</p>
        <p><strong>Date:</strong> ${e.date}</p>
        <p><strong>Time:</strong> ${e.time}</p>
        <p><strong>Organizer:</strong> ${e.organizer}</p>
        ${e.websiteURL ? `<p><strong>Website:</strong> <a href="${e.websiteURL}">${e.websiteURL}</a></p>` : ''}
        <p><strong>Tags:</strong> ${tagsHtml}</p>
        ${photosHtml}
        <p>See list of pending submissions <a href='https://humspotapp.com/admin-dashboard'>here</a>.</p>
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

export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const conn = await pool.getConnection();
  try {
    const event: Event = JSON.parse(gatewayEvent.body || '{}');

    // Ensure all data has bene passed through the event
    if (!event || typeof event.name !== 'string' || typeof event.description !== 'string' ||
      typeof event.location !== 'string' || typeof event.addedByUserID !== 'string' ||
      !Array.isArray(event.tags) || !Array.isArray(event.photoUrls)) {
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
    const userID: string = event.addedByUserID;
    let query: string = 'SELECT accountType FROM Users WHERE userID = ?';
    let params: (string | number)[] = [userID];
    const [result]: any[] = await conn.query(query, params);

    if (result.length > 0) { // The user exists, and we have the accountType.
      const accountType: string = result[0].accountType;
      if (accountType !== 'admin' && accountType !== 'organizer') {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            "Access-Control-Allow-Methods": '*',
            "Access-Control-Allow-Origin": '*'
          },
          body: JSON.stringify({
            message: `User with ID ${userID} is not approved to add an event!`, success: false
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
          message: `No user found with ID: ${userID} `, success: false
        }),
      };
    }

    // Check if an event with the same name already exists
    query = 'SELECT * FROM Submissions WHERE name = ?';
    params = [event.name];
    const [existingEvent]: any[] = await conn.query(query, params);

    if (existingEvent.length > 0) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          "Access-Control-Allow-Methods": '*',
          "Access-Control-Allow-Origin": '*'
        },
        body: JSON.stringify({
          message: `An event with the name "${event.name}" already exists.`, success: false
        }),
      };
    }

    // Add to Submissions table
    const submissionID: string = crypto.randomBytes(16).toString('hex');
    query = `
      INSERT INTO Submissions(
      submissionID, name, description, location, addedByUserID, activityType,
      websiteURL, date, time, latitude, longitude, organizer, submissionDate
    )
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    params = [
      submissionID, event.name, event.description, event.location, event.addedByUserID,
      'event', event.websiteURL, event.date, event.time, event.latitude, event.longitude, event.organizer
    ];

    await conn.query(query, params);

    // Insert Tags into SubmissionTags table
    for (const tag of event.tags) {
      const tagInsertQuery: string = 'INSERT INTO SubmissionTags (tagID, submissionID, tagName) VALUES (?, ?, ?)';
      const tagID: string = crypto.randomBytes(16).toString('hex');
      await conn.query(tagInsertQuery, [tagID, submissionID, tag]);
    }

    // Insert Photo URLs into SubmissionPhotos table
    for (const photoUrl of event.photoUrls) {
      const photoInsertQuery: string = 'INSERT INTO SubmissionPhotos (photoID, submissionID, photoUrl) VALUES (?, ?, ?)';
      const photoID: string = crypto.randomBytes(16).toString('hex');
      await conn.query(photoInsertQuery, [photoID, submissionID, photoUrl]);
    }

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
        message: 'Event submission successful.',
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

