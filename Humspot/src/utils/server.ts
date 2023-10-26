/**
 * @file server.ts
 * @filetype contains the code used to access backend services like Google and AWS.
 */

import AWS from "aws-sdk";

import awsconfig from "../aws-exports";
import { Amplify, Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";

import { nanoid } from "nanoid";

import { Camera, GalleryPhoto, GalleryPhotos } from "@capacitor/camera";

import {
  AWSAddAttractionResponse,
  AWSAddEventResponse,
  AWSAddImageResponse,
  AWSAddToFavoritesResponse,
  AWSAddToVisitedResponse,
  AWSGetCommentsResponse,
  AWSGetEventsGivenTagResponse,
  AWSGetFavoritesResponse,
  AWSLoginResponse,
  HumspotAttraction,
  HumspotCommentSubmit,
  HumspotEvent,
} from "./types";

Amplify.configure(awsconfig);

/**
 * @function handleGoogleLoginAndVerifyAWSUser
 * @description Handles login through Google. If successful, the user will be created in AWS IdentityPool.
 *
 * @todo this function will open the web browser to initiate google auth, and then redirect back to the application.
 * This redirection has not been implemented yet (currently only works on localhost); Deep links are required.
 *
 * @returns {Promise<boolean>} whether the auth federated sign in (GOOGLE) is successful
 */
export const handleGoogleLoginAndVerifyAWSUser = async (): Promise<boolean> => {
  try {
    await Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
    return true;
  } catch (error) {
    console.error("Error during sign-in", error);
    return false;
  }
};


/**
 * @function handleSignUp
 * @description Uses AWS auth with provided username, password, and email to sign up for Humspot.
 * An email is sent with a verification code upon successful sign up.
 * 
 * @param {string} email the provided user email address
 * @param {string} password the provided user password
 * @returns {Promise<boolean>} true if sign up successful, false otherwise
 */
export const handleSignUp = async (email: string, password: string): Promise<boolean> => {
  try {
    const result = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
      }
    });
    return true; // email verification sent!

  } catch (error) {
    console.log('error signing up:', error);
    return false;
  }
};


/**
 * @function confirmSignUp 
 * @description Checks to see if the sent verification code is valid, and, if so, 
 * confirms the user in the User Pool.
 * 
 * @param {string} email the provided user email address
 * @param {stirng} code the verification code sent to the email
 * @returns {Promise<boolean>} true if verification was successful, false otherwise.
 */
export const confirmSignUp = async (email: string, code: string): Promise<boolean> => {
  try {
    const result = await Auth.confirmSignUp(email, code);
    console.log(result);
    return true;
  } catch (error) {
    console.log('error confirming sign up:', error);
    return false;
  }
};


/**
 * @function handleSignIn
 * @description Signs the user in using a provided email and password.
 * 
 * @param {string} email the provided user email address.
 * @param {string} password the provided user password.
 * @returns {Promise<boolean>} whether login was successful or not.
 */
export const handleSignIn = async (email: string, password: string): Promise<boolean> => {
  try {
    const user = await Auth.signIn(email, password);
    console.log(user);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  };
};


/**
 * @function handleLogout
 * @description :ogs the user out of the application
 *
 * @returns {Promise<boolean>} true if the user successfully logged out, false otherwise
 */
export const handleLogout = async (): Promise<boolean> => {
  try {
    await Auth.signOut();
    return true;
  } catch (error) {
    console.error("Error during sign out " + error);
    return false;
  }
};


/**
 * @function handleForgotPassword 
 * @description Sends a password reset email containing a verification code.
 * 
 * @param {string} email the user's email to send the password reset verification code to.
 * @returns {Promise<boolean>} true if successfully sent, false otherwise.
 */
export const handleForgotPassword = async (email: string): Promise<boolean> => {
  try {
    await Auth.forgotPassword(email);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};


/**
 * @function handleResetPassword
 * @description Checks the verification code sent to the user's email and sets up a new password for their account.
 * 
 * @param {string} email the user's email.
 * @param {string} code the verification code sent to the user requesting to reset password.
 * @param {string} newPassword the password being used to reset account credentials.
 * @returns {Promise<boolean>} true if successfully reset, false otherwise.
 */
export const handleResetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
    return true;
  } catch (err) {
    console.log(err);
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
export const handleUserLogin = async (email: string | null, username: string | null, isGoogleAccount: boolean): Promise<AWSLoginResponse> => {
  try {
    if (!email || !username) throw new Error("Invalid email or username");
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const requestBody: Record<string, string> = {
      username: username,
      email: email,
      authProvider: isGoogleAccount ? "google" : "custom",
      accountType: "user",
      accountStatus: "active",
    };

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_CREATE_USER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseData: AWSLoginResponse = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
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

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_EVENT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newEvent),
      }
    );

    const responseData: AWSAddEventResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
  }
};


/**
 * @function handleAddEvent
 * @description Calls the AWS API gateway /add-attraction. This will add a new attraction to the database
 *
 * @param {HumspotAttraction} newAttraction the attraction to be added.
 *
 * @returns {Promise<AWSAddAttractionResponse>} response containing a message of success or error.
 * If success, the newly added attractionID is returned.
 */
export const handleAddAttraction = async (newAttraction: HumspotAttraction): Promise<AWSAddAttractionResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_ATTRACTION_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(newAttraction),
      }
    );

    const responseData: AWSAddAttractionResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
  }
};


/**
 * @function handleGetEventGivenTag
 * @description Gets an array of events that have a certain tag associated with it.
 * It returns 10 events at a time, and more can be loaded my incrementing the pageNum param.
 *
 * @param {number} pageNum the page number which corresponds to the offset when selecting rows in the table
 * @param {string} tag the event tag
 *
 * @returns {Promise<AWSGetEventsGivenTagResponse>} a status message along with an array of events that have a certain tag associated with it.
 */
export const handleGetEventGivenTag = async (pageNum: number, tag: string): Promise<AWSGetEventsGivenTagResponse> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_EVENT_GIVEN_TAG_URL +
      "/" +
      pageNum +
      "/" +
      tag,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData: AWSGetEventsGivenTagResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, events: [] };
  }
};


/**
 * @function handleAddImages
 * @description Calls the Capacitor Camera API to pick images from the gallery for upload.
 * After uploading to the provided bucker, the photoUrls are returned for later use.
 * 
 * NOTE: There is no API gateway or lambda function that uploads the images, 
 * it is all handled here on the client
 *
 * @param {string} bucketName the name of the S3 bucket to upload the images to
 * @param {string} fileName the name of the file path to upload the images to (e.g. event-photos/1234)
 * @param {boolean} isUnique whether the image should be a unique upload or override an existing image (as is the case with profile photos). Defaults to true.
 * @param {number} limit the maximum number of images to be uploaded. Defaults to 1.
 * @param {any} present A function that displays a toast message indicating upload status to the user.
 *
 * @returns {Promise<AWSAddImageResponse>} the success status as well as an array of photoUrls returned from S3
 */
export const handleAddImages = async (bucketName: string, fileName: string, isUnique: boolean = true, limit: number = 1, present: any): Promise<AWSAddImageResponse> => {

  AWS.config.update({
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
    region: "us-west-1",
  });

  let message = "";

  const photos: GalleryPhotos = await Camera.pickImages({
    quality: 90,
    limit: limit,
  });

  present({ message: "Uploading..." });
  const s3 = new AWS.S3();
  const photoUrls: string[] = [];

  for (let i = 0; i < limit; ++i) {
    const photo: GalleryPhoto = photos.photos[i];
    if (
      photo.format !== "jpeg" &&
      photo.format !== "jpg" &&
      photo.format !== "png"
    ) {
      message = "One or more images are not in jpg / png format!";
      continue;
    }
    const response: Response = await fetch(photo.webPath);
    const blob: Blob = await response.blob();

    if (blob.size > 15_000_000) {
      message = "One or more images exceeds the maximum file size limit (15 MB)";
      continue;
    }

    let uploadedFileName: string = '';

    if (isUnique) {
      const id: string = nanoid(8);
      uploadedFileName = `${fileName}-${id}-${Date.now()}-${photo.format}`;
    } else {
      uploadedFileName = `${fileName}`;
    }

    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: uploadedFileName,
      Body: blob,
      ContentType: blob.type,
    };

    try {
      const data = await s3.upload(params).promise();
      console.log(`File uploaded successfully at ${data.Location}`);
      photoUrls.push(data.Location);
    } catch (error) {
      console.log("Error uploading file:", error);
      return {
        success: false,
        message: "Error uploading 1 or more files",
        photoUrls: [],
      };
    }
  }

  if (message !== "") { // if there is an error message (outside of failing to upload)
    return {
      success: true,
      message: message,
      photoUrls: photoUrls,
    };
  }
  return {
    success: true,
    photoUrls: photoUrls,
  };
};


/**
 * @function handleAddToFavorites
 * @description Adds the activity (event or attraction) to the User's favorites list.
 * 
 * NOTE: List in this context refers a row entry in the Favorites table.
 *
 * @param {string} userID the ID of the currently logged in user
 * @param {string} activityID the ID of the activity (primary key of Activities table)
 *
 * @returns {Promise<AWSAddToFavoritesResponse>} a status message along with the newly created favoriteID.
 */
export const handleAddToFavorites = async (userID: string, activityID: string): Promise<AWSAddToFavoritesResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const params: Record<string, string> = {
      userID: userID,
      activityID: activityID,
    };

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_TO_FAVORITES_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(params),
      }
    );

    const responseData = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
  }
};


/**
 * @function handleAddToVisited
 * @description Adds an activity to a User's visited list.
 * 
 * NOTE: List in this context refers to a row entry in the Visited table.
 *
 * @param {string} userID the ID of the logged in user.
 * @param {string} activityID the If of the actvity (primary key of the Activities table).
 * @param {string} visitedDate the date the user visited the Activity (Event / Attraction)
 */
export const handleAddToVisited = async (userID: string, activityID: string, visitDate: string): Promise<AWSAddToVisitedResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const params: Record<string, string> = {
      userID: userID,
      activityID: activityID,
      visitDate: visitDate,
    };

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_TO_VISITED_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(params),
      }
    );

    const responseData: AWSAddToVisitedResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
  }
};


/**
 * @function handleAddComment
 * @description calls the AWS API gateway /add-comment. This will add a row to the Comments table.
 *
 * @param {HumspotCommentSubmit} comment the user comment data.
 *
 * @returns
 */
export const handleAddComment = async (comment: HumspotCommentSubmit) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_COMMENT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(comment),
      }
    );

    const responseData = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
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
 * @returns {Promise<AWSGetCommentsResponse>} a status message, and, if successful, an array of 10 comments of type GetCommentsResponse
 */
export const handleGetCommentsGivenUserID = async (pageNum: number, userID: string): Promise<AWSGetCommentsResponse> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_COMMENTS_GIVEN_USERID_URL +
      "/" +
      pageNum +
      "/" +
      userID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData: AWSGetCommentsResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, success: false, comments: [] };
  }
};


/**
 * @function handleGetFavoritesGivenUserID
 * @description gets an array of favorites from a specified user.
 * It returns 10 favorites at a time, and more can be loaded by incrementing the pageNum param.
 *
 * @param {number} pageNum
 * @param {string} userID
 *
 * @returns {Promise<AWSGetFavoritesResponse>} a status message, and if successful, an array of 10 favorites
 */
export const handleGetFavoritesGivenUserID = async (pageNum: number, userID: string): Promise<AWSGetFavoritesResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_FAVORITES_GIVEN_USERID_URL +
      "/" +
      pageNum +
      "/" +
      userID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const responseData: AWSGetFavoritesResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, favorites: [], success: false };
  }
};


/**
 * @function handleGetVisitedGivenUserID
 * @description gets an array of places visited from a specified user.
 * It returns 10 places the user has visited at a time, and more can be loaded by incrementing the pageNum param.
 *
 * @param {number} pageNum
 * @param {string} userID
 *
 * @returns {} a status message, and if successful, an array of 10 places most recently visited.
 */
export const handleGetVisitedGivenUserID = async (pageNum: number, userID: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_VISITED_GIVEN_USERID_URL +
      "/" +
      pageNum +
      "/" +
      userID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const responseData = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
  }
};


/**
 * @function handleGetEvent 
 * @description Calls the API gateway /get-event to retrieve the information about a certain event.
 * 
 * @param {stirng} eventID 
 * @returns 
 */
export const handleGetEvent = async (eventID: string) => {
  try {

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_EVENT_URL + "/" + eventID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
  }
};


/**
 * @function handleUpdateUserProfile
 * @description updates the user information in the Users table (username and bio).
 * 
 * @param {string} userID 
 * @param {string} username 
 * @param {string} bio 
 */
export const handleUpdateUserProfile = async (userID: string, username: string, bio: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const attemptedUpdateFields: Record<string, string> = {
      userID: userID,
      username: username,
      bio: bio,
    }

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_UPDATE_USER_PROFILE_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(attemptedUpdateFields),
      }
    );

    const responseData = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, success: false };
  }
};


/**
 * @function handleUpdateProfilePhoto 
 * @description Calls the AWS API gateway /update-profile-photo which updates the profile photo of the user.
 * 
 * @param {string} userID 
 * @param {string} profilePicURL 
 */
export const handleUpdateProfilePhoto = async (userID: string, profilePicURL: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const updateFields: Record<string, string> = {
      userID: userID,
      profilePicURL: profilePicURL
    }

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_UPDATE_PROFILE_PHOTO_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updateFields),
      }
    );

    const responseData = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, success: false };
  }
};