/**
 * @file server.ts
 * @filetype contains the code used to access backend services like Google and AWS.
 */

import AWS from 'aws-sdk';

import awsconfig from './aws-exports';
import { Amplify, Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";

import { nanoid } from "nanoid";

import { Camera, GalleryPhoto, GalleryPhotos } from '@capacitor/camera';

import { AWSAddEventResponse, AWSAddImageResponse, AWSAddToFavoritesResponse, AWSAddToVisitedResponse, AWSGetCommentsGivenUserIdResponse, AWSGetEventsGivenTagResponse, AWSLoginResponse, HumspotComment, HumspotEvent } from './types';

Amplify.configure(awsconfig);


/**
 * @function handleGoogleLoginAndVerifyAWSUser
 * @description handles login through Google. If successful, the user will be created in AWS IdentityPool.
 * 
 * @todo this function will open the web browser to initiate google auth, and then redirect back to the application. 
 * This redirection has not been implemented yet. Deep links are required.
 * 
 * @returns {Promise<boolean>} whether the auth federated sign in (GOOGLE) is successful
 */
export const handleGoogleLoginAndVerifyAWSUser = async (): Promise<boolean> => {
  try {
    await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
    return true;
  } catch (error) {
    console.error('Error during sign-in', error);
    return false;
  }
};


/**
 * @function handleLogout
 * @description logs the user out of the application
 * 
 * @returns {Promise<boolean>} true if the user successfully logged out, false otherwise
 */
export const handleLogout = async (): Promise<boolean> => {
  try {
    await Auth.signOut();
    return true;
  } catch (error) {
    console.error('Error during sign out ' + error);
    return false;
  }
};

/**
 * @function handleUserLogin
 * @description Calls the AWS API gateway /create-user. This will create a new user in the database if first time logging in.
 * 
 * @param {string | null} email 
 * @param {string | null} username 
 * 
 * @returns {Promise<AWSLoginResponse>} response containing a message of success or error.
 * If success, the user object is returned of type HumspotUser.
 */
export const handleUserLogin = async (email: string | null, username: string | null): Promise<AWSLoginResponse> => {
  try {
    if (!email || !username) throw new Error('Invalid email or username');
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const requestBody: Record<string, string> = {
      username: username,
      email: email,
      authProvider: 'google',
      accountType: 'user',
      accountStatus: 'active'
    };

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_CREATE_USER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(requestBody),
    });

    const responseData: AWSLoginResponse = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error calling API Gateway', error);
    return (
      { message: 'Error calling API Gateway' + error }
    )
  }
};


/**
 * @function handleAddEvent
 * @description Calls the AWS API gateway /add-event. This will add a new event to the database.
 * 
 * @param {HumspotEvent} newEvent the event to be added.
 * 
 * @returns {Promise<AWSAddEventResponse>} response containing a message of success or error.
 * If success, the newly added eventID is returned.
 */
export const handleAddEvent = async (newEvent: HumspotEvent): Promise<AWSAddEventResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    console.log(newEvent);

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_ADD_EVENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(newEvent),
    });

    const responseData: AWSAddEventResponse = await response.json();

    console.log(responseData);
    return responseData;

  } catch (error) {
    console.error('Error calling API Gateway', error);
    return (
      { message: 'Error calling API Gateway' + error }
    )
  }
};


/**
 * @function handleGetEventGivenTag
 * @description gets an array of events that have a certain tag associated with it.
 * It returns 10 events at a time, and more can be loaded my incrementing the pageNum param.
 * 
 * @param {number} pageNum the page number which corresponds to the offset when selecting rows in the table
 * @param {string} tag the event tag
 * 
 * @returns {Promise<AWSGetEventsGivenTagResponse>} a status message along with an array of events that have a certain tag associated with it.
 */
export const handleGetEventGivenTag = async (pageNum: number, tag: string): Promise<AWSGetEventsGivenTagResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_GET_EVENT_GIVEN_TAG_URL + "/" + pageNum + "/" + tag, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
    });

    const responseData: AWSGetEventsGivenTagResponse = await response.json();

    console.log(responseData);
    return responseData;

  } catch (error) {
    console.error('Error calling API Gateway', error);
    return (
      { message: 'Error calling API Gateway' + error, events: [] }
    )
  }
};


/**
 * @function handleAddImages 
 * @description calls the Capacitor Camera API to pick images from the gallery for upload.
 * It then uploads the images to the AWS S3 bucket 'activityphotos'. The photoUrls are returned to use later.
 * NOTE: The uploading of the images is handled client side (no API gateway or lambda function).
 * 
 * @param {string} userID the id of the user uploading the images
 * 
 * @returns {Promise<AWSAddImageResponse>} the success status as well as an array of photoUrls returned from S3
 */
export const handleAddImages = async (userID: string): Promise<AWSAddImageResponse> => {

  AWS.config.update({
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
    region: 'us-west-1'
  });

  const photos: GalleryPhotos = await Camera.pickImages({
    quality: 90,
    limit: 4
  });

  const s3 = new AWS.S3();
  const photoUrls: string[] = [];

  const limit: number = photos.photos.length < 4 ? photos.photos.length : 4;

  for (let i = 0; i < limit; ++i) {
    const photo: GalleryPhoto = photos.photos[i];
    if ((photo.format !== 'jpeg') && (photo.format !== 'jpg') && (photo.format !== 'png')) continue;
    const response: Response = await fetch(photo.webPath);
    const blob: Blob = await response.blob();

    if (blob.size > 15_000_000) continue;

    const id: string = nanoid(8);
    const fileName = `event-photos/${userID}-${id}-${Date.now()}-${photo.format}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: 'activityphotos',
      Key: fileName,
      Body: blob,
      ContentType: blob.type,
      // ACL: 'public-read'
    };

    try {
      const data = await s3.upload(params).promise();
      console.log(`File uploaded successfully at ${data.Location}`);
      photoUrls.push(data.Location);
    } catch (error) {
      console.log('Error uploading file:', error);
      return {
        success: false,
        photoUrls: []
      };
    }
  }

  return {
    success: true,
    photoUrls: photoUrls
  };
};


/** 
 * @function handleAddToFavorites
 * @description adds the activity (event or attraction) to the User's favorites list.
 * NOTE: their favorites are not a list, but exist as a row entry in the Favorites table.
 * 
 * @param {string} userID the ID of the currently logged in user
 * @param {string} activityID the ID of the activity (primary key of Activities table)
 * 
 * @returns {Promise<AWSAddToFavoritesResponse>} a status message along with the favoriteID.
 */
export const handleAddToFavorites = async (userID: string, activityID: string): Promise<AWSAddToFavoritesResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const params: Record<string, string> = {
      userID: userID,
      activityID: activityID
    };

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_ADD_TO_FAVORITES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(params),
    });

    const responseData = await response.json();

    console.log(responseData);
    return responseData;

  } catch (error) {
    console.error('Error calling API Gateway', error);
    return (
      { message: 'Error calling API Gateway' + error }
    )
  }
};


/**
 * @function handleAddToVisited
 * @description adds an activity to a User's visited list
 * 
 * @param {string} userID 
 * @param {string} activityID 
 */
export const handleAddToVisited = async (userID: string, activityID: string, visitDate: string): Promise<AWSAddToVisitedResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const params: Record<string, string> = {
      userID: userID,
      activityID: activityID,
      visitDate: visitDate
    };

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_ADD_TO_VISITED_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(params),
    });

    const responseData: AWSAddToVisitedResponse = await response.json();

    console.log(responseData);
    return responseData;

  } catch (error) {
    console.error('Error calling API Gateway', error);
    return (
      { message: 'Error calling API Gateway' + error }
    )
  }
};


/**
 * @function handleAddComment
 * @description calls the AWS API gateway /add-comment. This will add a row to the Comments table.
 * 
 * @param {HumspotComment} comment the user comment along with other attributes
 * 
 * @returns 
 */
export const handleAddComment = async (comment: HumspotComment) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_ADD_COMMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
      body: JSON.stringify(comment),
    });

    const responseData = await response.json();

    console.log(responseData);
    return responseData;

  } catch (error) {
    console.error('Error calling API Gateway', error);
    return (
      { message: 'Error calling API Gateway' + error }
    )
  }
};


/**
 * @function handleGetCommentsGivenUserID 
 * @description gets an array of comments from a specified user.
 * It returns 10 comments at a time, and more can be loaded my incrementing the pageNum param.
 * 
 * @param {number} pageNum 
 * @param {string} userID 
 * 
 * @returns {Promise<AWSGetCommentsGivenUserIdResponse>} a status message, and, if successful, an array of 10 comments of type GetCommentsResponse
 */
export const handleGetCommentsGivenUserID = async (pageNum: number, userID: string): Promise<AWSGetCommentsGivenUserIdResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_GET_COMMENTS_GIVEN_USERID_URL + "/" + pageNum + "/" + userID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      },
    });

    const responseData = await response.json();

    console.log(responseData);
    return responseData;

  } catch (error) {
    console.error('Error calling API Gateway', error);
    return (
      { message: 'Error calling API Gateway' + error }
    )
  }
}