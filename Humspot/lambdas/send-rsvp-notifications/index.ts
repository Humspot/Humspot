import { Context, Callback } from 'aws-lambda';
import * as admin from 'firebase-admin';
import * as mysql from 'mysql2/promise';

export function timeout(delay: number): Promise<unknown> {
  return new Promise((res) => setTimeout(res, delay));
};

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

type RSVPInfo = {
  userID: string;
  activityID: string;
};

const sendPushNotification = async (notificationsToken: string, info: string, activityID: string) => {
  console.log('sending push notification to ' + notificationsToken);
  try {
    const message: admin.messaging.Message = {
      notification: {
        title: 'Humspot',
        body: `You RSVP'd for ${info}, happening today!`,
      },
      data: {
        'route': `/activity/${activityID}`
      },
      token: notificationsToken,
    };
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const handler = async (event: any, context: Context, callback: Callback) => {
  const connection = await pool.getConnection();
  try {
    const url = 'https://notificationss.s3.us-west-1.amazonaws.com/humspot-web-deep-links-firebase-adminsdk-9o65y-0ae72b742a.json';
    const response = await fetch(url);
    if (!response.ok) { throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`); }
    const json = await response.json();
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(json)
      });
    }

    const today: string = new Date().toISOString().split('T')[0];
    const rsvpQuery: string = `
      SELECT userID, activityID
      FROM RSVP
      WHERE activityDate = ?
    `;
    const [rsvpRows]: any = await connection.execute(rsvpQuery, [today]);
    if (!Array.isArray(rsvpRows) || rsvpRows.length === 0) {
      console.log("No RSVPs found for today's date.");
      return;
    }
    let userIDs: string[] = [];
    let activityIDs: string[] = [];
    for (let i = 0; i < rsvpRows.length; ++i) {
      const rsvpInfo: RSVPInfo = rsvpRows[i];
      userIDs.push(rsvpInfo.userID);
      activityIDs.push(rsvpInfo.activityID);
    }
    const [userTokens]: any = await connection.query(`
      SELECT userID, notificationsToken
      FROM Users
      WHERE userID IN (?)
    `, [userIDs]);
    const [activityNames]: any = await connection.query(`
      SELECT activityID, name
      FROM Activities
      WHERE activityID IN (?)
    `, [activityIDs]);

    console.log(JSON.stringify(userTokens));
    console.log(JSON.stringify(activityNames));
    console.log("RSVP ROWS LENGTH: " + rsvpRows.length);
    for (let i = 0; i < rsvpRows.length; ++i) {
      const rsvp: RSVPInfo = rsvpRows[i];
      const token = userTokens.find((user: any) => user.userID === rsvp.userID)?.notificationsToken;
      const eventName = activityNames.find((activity: any) => activity.activityID === rsvp.activityID)?.name;
      if (token && eventName) {
        await sendPushNotification(token, eventName, rsvp.activityID);
        await timeout(500);
      }
    }
    if (connection) connection.release();
    return "Finished";
  } catch (err) {
    console.error(err);
    if (connection) connection.release();
    return 'Error: ' + err;
  } finally {
    if (connection) connection.release();
  }
};
