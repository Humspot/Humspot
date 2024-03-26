import { Context, Callback } from 'aws-lambda';
import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccountPath = path.join(__dirname, 'humspot-web-deep-links-firebase-adminsdk-9o65y-0ae72b742a.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = async (notificationsToken: string, info: string) => {
  try {
    const message: admin.messaging.Message = {
      notification: {
        title: 'Humspot',
        body: `${info}`,
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

  // access RSVP table and get list of userIDs and activityIDs from events with today's date
  // access Users table and use the list of userIDs to get a list of notificationsTokens for each user
  // access Activities table and use the list of activityIDs to get an event name for each user's RSVP
  // loop through list of notificationsTokens and call sendPushNotification function

  // temp test!
  const notificationsToken: string = 'eF-1sgI69E3svQsE3nqTYf:APA91bHd9v_aZBI76o7OCnY4N3PzlfPBvDDOl1i94sJBOe2UNSFLnf6bbYgrBO3bmKS9ep_XOWjBjo3vvY4-O-at7pdHe6vnl9nuA5KsywTdceU6C61pQJhqwaG35eps1pJRJzcwb9Yj';
  const eventName: string = 'THIS IS A NEW EVENT!'
  const message: string = `You RSVP\'d for ${eventName}, happening today!`;

  await sendPushNotification(notificationsToken, message);

  callback(null, 'Finished');

};
