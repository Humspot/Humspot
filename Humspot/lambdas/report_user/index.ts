/**
 * AWS lambda function which allows a user to report another user
 */

import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';


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


async function sendEmail(e: { reporterEmail: string; reporterUserID: string; suspectEmail: string; suspectUserID: string, details: string, activityID: string }) {

  const mailOptions = {
    from: `app.tellU@gmail.com`,
    to: `${e.reporterEmail}`,
    subject: 'You have reported a user on Humspot',
    html: `
      <div>
        <p>Thank you for your report. We will look into it and ensure this user has not violated any of Humspot's terms and conditions</p>
        <p>Reason: ${e.details}</p>
      </div>
    `
  };

  const mailOptionsToSubmittedUser = {
    from: `app.tellU@gmail.com`,
    to: `dy45@humboldt.edu, report@humspotapp.com, dyaranon126@gmail.com`,
    subject: 'Someone has reported a user on Humspot',
    html: `
      <div style="font-family: Arial, sans-serif">
        <p>Reporter Email: ${e.reporterEmail}</p>
        <p>Reporter ID: ${e.reporterUserID}</p>
        <p>Suspect Email: ${e.suspectEmail}</p>
        <p>Suspect userID: ${e.suspectUserID}</p>
        <p>Reason: ${e.details}</p>
        <p>Activity ID: ${e.activityID}</p>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    const other = await transporter.sendMail(mailOptionsToSubmittedUser);
    console.log('Email sent: ' + info.response);
    console.log('Other sent: ' + other.response);
    return { message: "Successfully reported user and sent out emails", success: true };
  } catch (error) {
    console.error('Error sending email', error);
    return { message: "Error sending email " + error, success: false };
  }
};



export const handler = async (gatewayEvent: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const { reporterUserID, reporterEmail, suspectUserID, suspectEmail, details, activityID } = JSON.parse(gatewayEvent.body);
  if (!reporterUserID || !reporterEmail || !suspectUserID || !details) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Missing params!' }),
    };
  }

  try {
    const res = await sendEmail({ reporterUserID, reporterEmail, suspectUserID, suspectEmail, details, activityID });
    return {
      statusCode: 200,
      body: JSON.stringify(res)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error reporting user ' + suspectUserID + ' ' + suspectEmail }),
    };
  }
};
