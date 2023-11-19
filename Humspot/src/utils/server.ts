/**
 * @file server.ts
 * @filetype contains the code used to access backend services like Google and AWS.
 */

import { nanoid } from "nanoid";

import awsconfig from "../aws-exports";
import { Amplify, Auth } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";

import {
  AddAttractionResponse,
  AddEventResponse,
  AddImageResponse,
  AddToFavoritesResponse,
  AddToVisitedResponse,
  GetInteractionsResponse,
  GetEventsGivenTagResponse,
  GetFavoritesResponse,
  LoginResponse,
  HumspotAttraction,
  HumspotCommentSubmit,
  HumspotEvent,
  GetActivityResponse,
  AddToRSVPResponse,
  GetFavoritesAndVisitedAndRSVPStatusResponse,
  GetHumspotEventResponse,
  GetEventsBetweenTwoDatesStatusResponse,
  AddCommentImageResponse
} from "./types";

import { Camera, GalleryPhoto, GalleryPhotos } from "@capacitor/camera";


/* Allows for AWS Authentication */
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
 * @param {string} code the verification code sent to the email
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
 * @description logs the user out of the application
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
 * @returns {Promise<LoginResponse>} response containing a message of success or error.
 * If success, the user object is returned of type HumspotUser.
 */
export const handleUserLogin = async (email: string | null, username: string | null, isGoogleAccount: boolean): Promise<LoginResponse> => {
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

    const responseData: LoginResponse = await response.json();
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
 * @returns {Promise<AddEventResponse>} response containing a message of success or error.
 * If success, the newly added eventID is returned.
 */
export const handleAddEvent = async (newEvent: HumspotEvent): Promise<AddEventResponse> => {
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

    const responseData: AddEventResponse = await response.json();

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
 * @returns {Promise<AddAttractionResponse>} response containing a message of success or error.
 * If success, the newly added attractionID is returned.
 */
export const handleAddAttraction = async (newAttraction: HumspotAttraction): Promise<AddAttractionResponse> => {
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

    const responseData: AddAttractionResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error };
  }
};


/**
 * @function handleGetActivitiesGivenTag
 * @description Gets an array of events that have a certain tag associated with it.
 * It returns 10 events at a time, and more can be loaded my incrementing the pageNum param.
 *
 * @param {number} pageNum the page number which corresponds to the offset when selecting rows in the table
 * @param {string} tag the event tag
 *
 * @returns {Promise<GetActivitiesGivenTagResponse>} a status message along with an array of events that have a certain tag associated with it.
 */
export const handleGetActivitiesGivenTag = async (pageNum: number, tag: string): Promise<any> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_ACTIVITIES_GIVEN_TAG_URL +
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

    const responseData: any = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, events: [] };
  }
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
 * @returns {Promise<AddToFavoritesResponse>} a status message along with the newly created favoriteID.
 */
export const handleAddToFavorites = async (userID: string, activityID: string): Promise<AddToFavoritesResponse> => {
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
    return { message: "Error calling API Gateway" + error, success: false };
  }
};


/**
 * @function handleAddToVisited
 * @description Adds an activity to a User's visited list.
 * 
 * NOTE: List in this context refers to a row entry in the Visited table.
 *
 * @param {string} userID the ID of the logged in user.
 * @param {string} activityID the If of the activity (primary key of the Activities table).
 * @param {string} visitedDate the date the user visited the Activity (Event / Attraction)
 */
export const handleAddToVisited = async (userID: string, activityID: string, visitDate: string): Promise<AddToVisitedResponse> => {
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

    const responseData: AddToVisitedResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, success: false };
  }
};

/**
 * @function handleAddToRSVP
 * @description Adds an activity to a User's RSVP list.
 * 
 * NOTE: List in this context refers to a row entry in the RSVP table.
 *
 * @param {string} userID the ID of the logged in user.
 * @param {string} activityID the If of the activity (primary key of the Activities table).
 * @param {string} rsvpDate the date the user visited the Activity (Event / Attraction)
 */
export const handleAddToRSVP = async (userID: string, activityID: string, rsvpDate: string): Promise<AddToRSVPResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const params: Record<string, string> = {
      userID: userID,
      activityID: activityID,
      rsvpDate: rsvpDate,
    };

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_ACTIVITY_TO_RSVP_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(params),
      }
    );

    const responseData: AddToRSVPResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, success: false };
  }
};

export const handleAddProfileImageToS3 = async (userID: string, blob: Blob): Promise<AddImageResponse> => {
  try {
    let photoUrl: string = '';
    if (blob) {
      const res = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_ADD_IMAGE_TO_S3_URL, {
        method: 'POST',
        body: JSON.stringify({
          photoType: blob.type,
          activityName: `${userID}-profile-photo`,
          folderName: 'profile-pictures',
          bucketName: 'profile--photos',
          isUnique: false,
        })
      });
      const data: AddCommentImageResponse = await res.json();
      console.log(data);
      if (!res.ok || !data.success) throw new Error("Error uploading photo to S3 database!");
      const { uploadUrl, bucketName, region, key } = data;
      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type,
        },
      });

      if (s3Response.ok) {
        console.log('Image uploaded successfully');
        photoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
      } else {
        throw new Error("Error uploading photo to S3 database!");
      }
    }
    return {
      success: true,
      message: 'Added profile photo successfully',
      photoUrl: photoUrl
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: 'Something went wrong uploading photo to S3 database',
      photoUrl: ''
    }
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
export const handleAddComment = async (comment: HumspotCommentSubmit, blob: Blob | null, activityName: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    // if the user submitted a photo with their comment
    let photoUrl: string | null = null;
    if (comment.photoUrl && blob) {
      const res = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_ADD_IMAGE_TO_S3_URL, {
        method: 'POST',
        body: JSON.stringify({
          photoType: blob.type,
          activityName: activityName,
          folderName: 'comment-photos',
          bucketName: 'activityphotos',
          isUnique: true,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data: AddCommentImageResponse = await res.json();
      console.log(data);
      if (!res.ok || !data.success) throw new Error("Error uploading photo to S3 database!");
      const { uploadUrl, bucketName, region, key } = data;

      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type,
        },
      });

      if (s3Response.ok) {
        console.log('Image uploaded successfully');
        photoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
      } else {
        throw new Error("Error uploading photo to S3 database!");
      }
    }

    let commentWithPhotoUrl = comment;
    commentWithPhotoUrl.photoUrl = photoUrl;

    console.log(commentWithPhotoUrl);

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_COMMENT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(commentWithPhotoUrl),
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
 * @function handleGetInteractionsGivenUserID
 * @description gets an array of comments and/or RSVP'd events from a specified user.
 * It returns 20  at a time, and more can be loaded my incrementing the pageNum param.
 *
 * @param {number} pageNum
 * @param {string} userID
 *
 * @returns {Promise<GetCommentsResponse>} a status message, and, if successful, an array of 20 comments and/or RSVP'd events of type GetCommentsResponse
 */
export const handleGetInteractionsGivenUserID = async (pageNum: number, userID: string): Promise<GetInteractionsResponse> => {
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

    const responseData: GetInteractionsResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, success: false, interactions: [] };
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
 * @returns {Promise<GetFavoritesResponse>} a status message, and if successful, an array of 10 favorites
 */
export const handleGetFavoritesGivenUserID = async (pageNum: number, userID: string): Promise<GetFavoritesResponse> => {
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

    const responseData: GetFavoritesResponse = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, favorites: [], success: false };
  }
};


/**
 * @function handleGetVisitedGivenUserID
 * @description Gets an array of places visited from a specified user.
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
 * @param {string} eventID 
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
      username: username.replace(/\s/g, ""),
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


/**
 * @function handleGetActivity
 * @description Retrieves the activity (event / attraction) information from the backend.
 * 
 * @param {string} activityID the ID of the activity
 * @returns {Promise<GetActivityResponse>} the activity information
 */
export const handleGetActivity = async (activityID: string): Promise<GetActivityResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_ACTIVITY_URL + `/${activityID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        }
      }
    );

    const responseData: GetActivityResponse = await response.json();

    console.log(responseData);
    return responseData;

  } catch (err) {
    console.error(err);
    return {
      message: "Error fetching activity",
      success: false
    }
  }
};


/**
 * @function handleGetFavoritesAndVisitedAndRSVPStatus
 * @description gets whether the user has favorited, visited, and/or RSVP'd for the activity.
 * 
 * @param {string} userID 
 * @param {string} activityID 
 * @returns {GetFavoritesAndVisitedAndRSVPStatusResponse} an object containing the statuses along with a message
 */
export const handleGetFavoritesAndVisitedAndRSVPStatus = async (userID: string, activityID: string): Promise<GetFavoritesAndVisitedAndRSVPStatusResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_FAVORITES_VISITED_STATUS_URL + "/" + userID + "/" + activityID,
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

  } catch (err) {
    console.error(err);
    return {
      message: "Error fetching status",
      success: false,
      favorited: null,
      visited: null,
      rsvp: null
    }
  }
};



export const handleGetEventsBetweenTwoDates = async (date1: string, date2: string): Promise<GetEventsBetweenTwoDatesStatusResponse> => {

  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(

      import.meta.env.VITE_AWS_API_GATEWAY_GET_EVENTS_BETWEEN_TWO_DATES + "/" + date1 + "/" + date2,
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
  } catch (err) {
    console.error(err);
    return { message: "Error calling API Gateway" + err, events: [], success: false };
  }
};



/**
 * 
 * @param {number} pageNum 
 * @param {string} userID 
 * @returns 
 */
export const handleGetPendingActivitySubmissions = async (pageNum: number, userID: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_PENDING_ACTIVITY_SUBMISSIONS_URL +
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
    return { message: "Error calling API Gateway" + error, success: false, pendingSubmissions: [] };
  }
};


/**
 * @function handleGetThisWeeksEvents
 * @description gets the events that are happening this week (within the next 7 days, inclusive).
 * 
 * @returns {message: string; success: boolean; events: GetHumspotEventResponse[]}
 */
export const handleGetThisWeeksEvents = async (): Promise<{ message: string; success: boolean; events: GetHumspotEventResponse[] }> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_THIS_WEEKS_EVENTS,
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
    return { message: "Error calling API Gateway" + error, success: false, events: [] };
  }
};


export const handleSubmitEventForApproval = async (event: HumspotEvent) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_SUBMIT_EVENT_FOR_APPROVAL_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(event),
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


export const handleUploadEventImages = async (blobs: Blob[] | null) => {
  if (!blobs) {
    return {
      success: false,
      message: 'Blobs array is not available',
      photoUrls: []
    }
  }
  try {
    let photoUrls: string[] = [];
    for (let i = 0; i < blobs.length; ++i) {
      const blob: Blob = blobs[i];
      const id: string = nanoid(8);
      const res = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_ADD_IMAGE_TO_S3_URL, {
        method: 'POST',
        body: JSON.stringify({
          photoType: blob.type,
          activityName: id,
          folderName: 'event-photos',
          bucketName: 'activityphotos',
          isUnique: false,
        })
      });
      const data: AddCommentImageResponse = await res.json();
      console.log(data);
      if (!res.ok || !data.success) throw new Error("Error uploading photo to S3 database!");
      const { uploadUrl, bucketName, region, key } = data;
      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': blob.type,
        },
      });

      if (s3Response.ok) {
        console.log('Image uploaded successfully');
        photoUrls.push(`https://${bucketName}.s3.${region}.amazonaws.com/${key}`);
      } else {
        throw new Error("Error uploading photo to S3 database!");
      }
    }
    return {
      success: true,
      message: "Photos uploaded successfully",
      photoUrls: photoUrls
    }
  } catch (err) {
    console.log(err);
    return {
      message: "error uploading",
      success: false,
      photoUrls: []
    }
  }
}