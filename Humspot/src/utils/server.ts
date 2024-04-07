/**
 * @file server.ts
 * @fileoverview contains the code used to access backend services like Google and AWS.
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
  AddCommentImageResponse,
  GetSubmittedActivitiesResponse,
  OrganizerRequestSubmission,
  SubmissionInfo,
  HumspotCommentResponse,
  HumspotUser
} from "./types";

import { Capacitor } from '@capacitor/core';
import { Preferences } from "@capacitor/preferences";

// Determine if the app is running on web or as a native app
const isWebPlatform = !Capacitor.isNativePlatform();

const redirectSignIn = isWebPlatform
  ? 'http://localhost:5173/'
  : 'https://humspotapp.com/redirect-sign-in/';
const redirectSignOut = isWebPlatform
  ? 'http://localhost:5173/'
  : 'https://humspotapp.com/redirect-sign-in/';

const updatedAwsConfig = {
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    redirectSignIn,
    redirectSignOut,
  },
};

// Configure Amplify
Amplify.configure(updatedAwsConfig);


/**
 * @function handleGoogleLoginAndVerifyAWSUser
 * @description Handles login through Google. If successful, the user will be created in AWS IdentityPool.
 *
 * @todo this function will open the web browser to initiate google auth, and then redirect back to the application.
 * This redirection has not been implemented yet (currently only works on localhost); Deep links are required.
 *
 * @returns {Promise<boolean>} whether the auth federated sign in (GOOGLE) is successful
 * 
 * @example
 * ```ts
 * await handleGoogleLoginAndVerifyAWSUser();
 * ...
 * const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
 *  switch (event) {
 *     case "signIn": // called after handleGoogleLoginAndVerifyAWSUser resolves as true
 *       const currentUser = await Auth.currentAuthenticatedUser();
 *       // handle current user logging in
 *       break;
 *     ...
 *   }
 * });
 * ```
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
 * 
 * @example
 * ```ts
 * const email: string = 'email@example.com'; // from user input
 * const password: string = 'myAwesomePassword'; // from user input
 * const success: boolean = await handleSignUp(email, password);
 * if (success) {
 *  // sign up successful, code has been emailed to user, redirect as needed
 * } else {
 *  // email has already been registerd / something went wrong on backend
 * }
 * ```
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
 * 
 * @example 
 * ```ts
 * const email: string = 'email@example.com'; // from user input
 * const code: string = '123456'; // from user input, emailed code
 * const success: boolean = await confirmSignUp(email, code);
 * if (success) { 
 *  // user has been added successfully to database and AWS amplify auth 
 * } else { 
 *  //email/code combination incorrect, user has not been added to database or AWS amplify auth
 * }
 * ```
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
 * 
 * @example 
 * ```ts
 * const email: string = 'email@example.com'; // from user input
 * const password: string = 'password@example.com'; // from user input
 * await handleSignIn(email, password);
 * ...
 * const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
 *  switch (event) {
 *     case "signIn": // called after handleSignIn resolves as true
 *       const currentUser = await Auth.currentAuthenticatedUser();
 *       // handle current user logging in, see handleUserLogin function
 *       break;
 *     ...
 *   }
 * });
 * ```
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
 * @description logs the user out of the application.
 *
 * @returns {Promise<boolean>} true if the user successfully logged out, false otherwise
 * 
 * @example 
 * ```ts
 * const isLoggedOut: boolean = await handleLogout();
 * if (isLoggedOut) {
 *  // user successfully logged out, redirect as needed
 * } else {
 *  // something went wrong, display error toast message
 * }
 * ```
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
 * @function handleDeleteAccount
 * @description deletes the user's AWS amplify account from the user pool and removes their info from the database.
 * 
 * @param {string} userID the user's uid
 * @returns a success status / message indicating successful / failed deletion of account
 */
export const handleDeleteAccount = async (userID: string) => {
  try {
    const res = await Auth.deleteUser();
    if (res) {
      const response = await fetch(
        import.meta.env.VITE_AWS_API_GATEWAY_DELETE_USER_FROM_DATABASE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userID }),
        }
      );
      const responseData: { success: boolean; message: string } = await response.json();
      return responseData;
    }
    return { success: false, message: "Error during delete account!" };

  } catch (err) {
    console.error("Error during delete account " + err);
    return { success: false, message: "Error during delete account " + err };
  }
};


/**
 * @function handleForgotPassword 
 * @description Sends a password reset email containing a verification code.
 * 
 * @param {string} email the user's email to send the password reset verification code to.
 * @returns {Promise<boolean>} true if successfully sent, false otherwise.
 * 
 * @example 
 * ```ts
 * const email: string = "email@example.com"; // from user input
 * const success: boolean = await handleForgotPassword(email);
 * if (success) {
 *  // reset password email sent successfully, redirect as needed to enter code
 * } else {
 *  // email not in database / something went wrong
 * }
 * ```
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
 * 
 * @example 
 * ```ts
 * const email: string = 'email@example.com'; // from user input
 * const code: string = `123456`; // from user input, emailed code
 * const newPassword: string = 'myNewPassword'; // from user input
 * const success: boolean = await handleResetPassword(email, code, newPassword);
 * if (success) {
 *  //successfully reset password, redirect to the sign in page
 * } else {
 *  // email/code combination incorrect or something went wrong
 * }
 * ```
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
 * Otherwise, it will return the existing user's information as an object of type HumspotUser.
 *
 * @param {string | null} email
 * @param {string | null} username
 *
 * @returns {Promise<LoginResponse>} response containing a message of success or error.
 * If success, the user object is returned of type HumspotUser.
 * 
 * @example 
 * ```ts 
 * const email: string | null = 'email@example.com';
 * const username: string | null = 'myUsername';
 * const isGoogleAccount: boolean = true; // true if user logged in with Google, false if using email/password
 * const res: LoginResponse = await handleUserLogin(email, username, isGoogleAccount);
 * if (res.user) { 
 *  setHumspotUser(res.user); 
 * }
 * ```
 */
export const handleUserLogin = async (email: string | null, username: string | null, isGoogleAccount: boolean): Promise<LoginResponse> => {
  try {
    if (!email || !username) throw new Error("Invalid email or username");
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const notificationsToken: string | null = ((await Preferences.get({ key: 'notificationsToken' })).value) ?? localStorage.getItem('notificationsToken');

    const requestBody: Record<string, string> = {
      username: username,
      email: email,
      authProvider: isGoogleAccount ? "google" : "custom",
      accountType: "user",
      accountStatus: "active",
      notificationsToken: notificationsToken ?? ''
    };
    console.log(requestBody);

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
 * @note This function is for testing purposes only. The /add-event function should be called internally,
 * as all events must be approved by an admin. 
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
 * @function handleAddEAttraction
 * @description Calls the AWS API gateway /add-attraction. This will add a new attraction to the database
 * @note This function is for testing purposes only. The /add-attraction function should be called internally,
 * as all attractions must be approved by an admin. 
 *
 * @param {HumspotAttraction} newAttraction the attraction to be added.
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
 * @returns {Promise<{message: string; activities: any[]; success: boolean;}>} a status message and a success flag along with an array of activities.
 * 
 * @example
 * ```ts 
 * const tag: string = 'Adventure';
 * const pageNum: number = 2;
 * const res = await handleGetActivitiesGivenTag(pageNum, tag);
 * if (res.success) {
 *  setActivities(res.activities);
 * }
 * ```
 */
export const handleGetActivitiesGivenTag = async (pageNum: number, tag: string): Promise<{ message: string; activities: any[]; success: boolean; }> => {
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
    return { message: "Error calling API Gateway" + error, activities: [], success: false };
  }
};


/**
 * 
 * @param pageNum 
 * @param userID 
 * @returns 
 */
export const handleGetApprovedSubmissions = async (pageNum: number, userID: string) => {
  try {
    const url: string = import.meta.env.VITE_AWS_API_GATEWAY_GET_APPROVED_SUBMISSIONS_URL + "/" + pageNum + "/" + userID;
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData: { message: string; submissions: { description: string; name: string; activityID: string; image_url: string }[]; success: boolean } = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, submissions: [], success: false };
  }
};


/**
 * @function handleAddToFavorites
 * @description Adds the activity (event or attraction) to the User's favorites list.
 * @note List in this context refers a row entry in the Favorites table.
 *
 * @param {string} userID the ID of the currently logged in user
 * @param {string} activityID the ID of the activity (primary key of Activities table)
 *
 * @returns {Promise<AddToFavoritesResponse>} a status message along with the newly created favoriteID.
 * 
 * @example
 * ```tsx
 * const userID: string = 'myUserID';
 * const activityID: string = '1234';
 * const res = await handleAddToFavorites(userID, activityID);
 * if (res.success) { 
 *  // activity has been added to user's favorites 
 * }
 * if (res.removed) { 
 *  // activity has been removed from user's favorites 
 * }
 * ````
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
 * @description Adds (or removes, if already visited) an activity to a User's visited list.
 * @note List in this context refers to a row entry in the Visited table.
 * @todo remove the 'local' visitDate param and use server-side date instead.
 *
 * @param {string} userID the ID of the logged in user.
 * @param {string} activityID the If of the activity (primary key of the Activities table).
 * @param {string} visitedDate the date the user visited the Activity (Event / Attraction)
 * @returns {Promise<AddToVisitedResponse>} a success message / status and whether the activity has been added or removed from their Visited list.
 * 
 * @example 
 * ```ts 
 * const userID: string = context.humspotUser.userID; // from global user context, or some other method
 * const { activityID } = useParams<PageParams>(); // from current page URL, or some other method
 * const visitDate: string = new Date().toISOString(); 
 * const res = await handleAddToVisited(userID, activityID, visitDate);
 * if (res.success) {
 *  if (res.removed) {
 *    // activity has been removed from Visited list
 *  } else {
 *    // activity has been added to Visited list
 *  }
 * } else {
 *  // something went wrong when trying to add to Visited lsit
 * }
 * ```
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
 * @description Adds (or removes, if already in RSVP list) an activity to a User's RSVP list.
 * @note List in this context refers to a row entry in the RSVP table.
 * @todo remove the 'local' rsvpDate param and use server-side date instead.
 * @todo include the date/time of the activity so that a notification can be sent out to the user.
 *
 * @param {string} userID the ID of the logged in user.
 * @param {string} activityID the If of the activity (primary key of the Activities table).
 * 
 * @example 
 * ```ts 
 * const userID: string = context.humspotUser.userID; // from global user context, or some other method
 * const { activityID } = useParams<PageParams>(); // from current page URL, or some other method
 * const res = await handleAddToRSVP(userID, activityID, activityDate);
 * if (res.success) {
 *  if (res.removed) {
 *    // activity has been removed from RSVP list
 *  } else {
 *    // activity has been added to RSVP list
 *  }
 * } else {
 *  // something went wrong when trying to add to RSVP list
 * }
 * ```
 */
export const handleAddToRSVP = async (userID: string, activityID: string, activityDate: string | undefined): Promise<AddToRSVPResponse> => {
  if (!activityDate || !userID || !activityID) throw new Error('Invalid params');
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const params: Record<string, string> = {
      userID: userID,
      activityID: activityID,
      activityDate: activityDate
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


/**
 * @function handleAddProfileImageToS3
 * @description Uploads an image to profile-pictures/profile--photos/`${userID}-profile-photo`.
 * Any existing profile photo will be overwritten.
 * 
 * @param {string} userID the user's ID
 * @param {Blob} blob the photo data
 * @returns {Promise<AddImageResponse>} a status message, a success flag, and a photo URL corresponding to the uploaded image.
 * 
 * @example 
 * ```ts
 * const image = await Camera.getPhoto({...}); // using Capacitor Camera API
 * const path = await fetch(image.webPath!);
 * const blob: Blob = await path.blob();
 * const userID; string = context.humspotUser.userID; // from global context variable, or some other method
 * const res = await handleAddProfileImageToS3(userID, blob);
 * if (res.success) {
 *  // set profile photo URl to res.photoUrl;
 * } else {
 *  // something went wrong when uploading picture
 * }
 * ```
 */
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
 * @todo add return type to function.
 *
 * @param {HumspotCommentSubmit} comment the user comment data.
 * 
 * @example 
 * ```ts
 * const comment: HumpspotCommentSubmit = { commentText: 'This is a comment!', userID: context.humspotUser.userID, activityID: `123456`, photoUrl: null };
 * await handleAddComment(comment, null, 'Cool Activity'); // no image is uploaded with comment
 * ```
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
 * It returns 20 at a time, and more can be loaded my incrementing the pageNum param.
 *
 * @param {number} pageNum
 * @param {string} userID
 *
 * @returns {Promise<GetInteractionsResponse>} a status message, a success flag, and an array of at most 20 comments and/or RSVP'd events of type GetCommentsResponse
 * 
 * @example
 * ```ts
 * let interactionsArray: HumspotInteractionsResponse[] = [];
 * const res: GetInteractionsResponse = await handleGetInteractionGivenUserID(1, 'myUserID');
 * if (res.success) {
 *  interactionsArray.push(...res.interactions);
 * }
 * ```
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
export const handleGetFavoritesGivenUserID = async (pageNum: number, userID: string, isCallingForSelf: boolean = true): Promise<GetFavoritesResponse> => {
  try {
    if (isCallingForSelf) {
      const currentUserSession = await Auth.currentSession();

      if (!currentUserSession.isValid()) throw new Error("Invalid auth session");
    }

    // const idToken = currentUserSession.getIdToken();
    // const jwtToken = idToken.getJwtToken();

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
          // Authorization: `Bearer ${jwtToken}`,
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
export const handleGetVisitedGivenUserID = async (pageNum: number, userID: string, isCallingForSelf: boolean = true) => {
  try {
    if (isCallingForSelf) {
      const currentUserSession = await Auth.currentSession();

      if (!currentUserSession.isValid()) throw new Error("Invalid auth session");
    }

    // const idToken = currentUserSession.getIdToken();
    // const jwtToken = idToken.getJwtToken();

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
          // Authorization: `Bearer ${jwtToken}`,
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
    // const currentUserSession = await Auth.currentSession();

    // if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    // const idToken = currentUserSession.getIdToken();
    // const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_ACTIVITY_URL + `/${activityID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${jwtToken}`,
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


/**
 * @function handleGetEventsBetweenTwoDates
 * @description it is in the name lol
 * 
 * @param {string} date1 
 * @param {string} date2 
 * @returns 
 */
export const handleGetEventsBetweenTwoDates = async (date1: string, date2: string): Promise<GetEventsBetweenTwoDatesStatusResponse> => {
  try {
    const response = await fetch(

      import.meta.env.VITE_AWS_API_GATEWAY_GET_EVENTS_BETWEEN_TWO_DATES + "/" + date1 + "/" + date2,
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
 * @returns {Promise<{message: string; success: boolean; events: GetHumspotEventResponse[]}>} a success status / message an an array of events
 */
export const handleGetThisWeeksEvents = async (): Promise<{ message: string; success: boolean; events: GetHumspotEventResponse[] }> => {
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_THIS_WEEKS_EVENTS,
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
    return { message: "Error calling API Gateway" + error, success: false, events: [] };
  }
};


/**
 * @function handleSubmitEventForApproval
 * 
 * @param {HumspotEvent} event 
 * @returns 
 */
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


/**
 * 
 * @param blobs 
 * @param folderName 
 * @returns 
 */
export const handleUploadSubmissionImages = async (blobs: Blob[] | null, folderName: string) => {
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
          folderName: folderName,
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
};


/**
 * @function handleGetSubmittedActivities
 * @description gets a list of activities (events/attractions) submitted by a user.
 * NOTE: The list contains pending activities only, if they have been approved they will not be returned by this function.
 * 
 * @param {string} userID the id of the user
 * @param {number} pageNum pagination
 * @returns {GetSubmittedActivitiesResponse} success status and message, and an array of pending activities.
 */
export const handleGetSubmittedActivities = async (userID: string, pageNum: number): Promise<GetSubmittedActivitiesResponse> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GET_SUBMITTED_ACTIVITIES_GIVEN_USER_ID + "/" + userID + "/" + pageNum,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const responseData: GetSubmittedActivitiesResponse = await response.json();

    console.log(responseData);
    return responseData;

  } catch (err) {
    console.error(err);
    return {
      message: "Error fetching status",
      success: false,
      submittedActivities: []
    }
  }

};


/**
 * @function handleSubmitRequestToBecomeOrganizer 
 * @description submits a request for a user to become an organizer. An email is sent to the admin list
 * to notify them of the incoming request.
 * 
 * @param {OrganizerRequestSubmission} data the user's information that is being submitted
 * @returns 
 */
export const handleSubmitRequestToBecomeOrganizer = async (data: OrganizerRequestSubmission) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_SUBMIT_REQUEST_FOR_EVENT_ORGANIZER_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
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
 * 
 * @param userID 
 * @param activityID 
 * @param rating 
 * @returns 
 */
export const handleAddRating = async (userID: string, activityID: string, rating: number): Promise<{ message: string; success: boolean; }> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const data = {
      userID: userID,
      activityID: activityID,
      rating: rating
    };

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_ADD_RATING,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    const responseData: { message: string; success: boolean; } = await response.json();

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error calling API Gateway", error);
    return { message: "Error calling API Gateway" + error, success: false };
  }
};


/**
 * 
 * @param userID 
 * @param activityID 
 * @returns 
 */
export const getUserRatingGivenUserID = async (userID: string, activityID: string): Promise<{ message: string, success: boolean; ratingInfo?: { rating: number; hasRated: string } }> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_RATING_GIVEN_USERID +
      "/" +
      userID +
      "/" +
      activityID,
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
    return { message: "Error calling API Gateway" + error, success: false };
  }
};


/**
 * 
 * @param pageNum 
 * @param userID 
 * @returns 
 */
export const handleGetPendingOrganizerSubmissions = async (pageNum: number, userID: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_PENDING_ORGANIZER_SUBMISSIONS_URL +
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
 * 
 * @param approverID 
 * @param submitterID 
 * @param submitterEmail 
 * @param submissionID 
 * @param reason 
 * @returns 
 */
export const handleApproveOrganizer = async (approverID: string, submitterID: string, submitterEmail: string, submissionID: string, reason: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const info = {
      approverID: approverID,
      submitterID: submitterID,
      submitterEmail: submitterEmail,
      submissionID: submissionID,
      reason: reason,
    };

    console.log(info);

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_APPROVE_ORGANIZER_SUBMISSION,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(info)
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
 * 
 * @param approverID 
 * @param submitterID 
 * @param submitterEmail 
 * @param submissionID 
 * @param reason 
 * @returns 
 */
export const handleDenyOrganizer = async (approverID: string, submitterID: string, submitterEmail: string, submissionID: string, reason: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const info = {
      approverID: approverID,
      submitterID: submitterID,
      submitterEmail: submitterEmail,
      submissionID: submissionID,
      reason: reason,
    };

    console.log(info);

    const response = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_DENY_ORGANIZER_SUBMISSION,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(info)
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
 * 
 * @param pageNum 
 * @param userID 
 * @returns 
 */
export const handleGetApprovedOrganizerSubmissions = async (pageNum: number, userID: string): Promise<{ message: string; success: boolean; organizerList: { username: string }[] }> => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_APPROVED_ORGANIZERS_URL +
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
    return { message: "Error calling API Gateway" + error, success: false, organizerList: [] };
  }
};


/**
 * 
 * @param userID 
 * @param submissionID 
 * @returns 
 */
export const handleGetSubmissionInfo = async (userID: string, submissionID: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_PENDING_ACTIVITY_SUBMISSION_INFO +
      "/" +
      userID +
      "/" +
      submissionID,
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
 * 
 * @param event 
 * @returns 
 */
export const handleSubmitAttractionForApproval = async (event: HumspotAttraction) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_SUBMIT_ATTRACTION_FOR_APPROVAL,
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


/**
 * 
 * @param adminUserID 
 * @param info 
 * @param reason 
 * @returns 
 */
export const handleApproveActivitySubmission = async (adminUserID: string, info: SubmissionInfo, reason: string) => {
  try {
    const currentUserSession = await Auth.currentSession();

    if (!currentUserSession.isValid()) throw new Error("Invalid auth session");

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

    const event = {
      adminUserID: adminUserID,
      submissionInfo: info,
      reason: reason
    }

    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_APPROVE_ACTIVITY,
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


/**
 * @function handleGetCommentsGivenActivityID
 * @description Gets the comments from a given activity in batches of 10.
 * 
 * @param {string} activityID 
 * @param {number} pageNum 
 * 
 * @returns {Promise<{ message: string; comments?: HumspotCommentResponse[], success: boolean }>} a success message and an array of comments
 */
export const handleGetCommentsGivenActivityID = async (activityID: string, pageNum: number): Promise<{ message: string; comments?: HumspotCommentResponse[], success: boolean }> => {
  if (!activityID || pageNum < 1) return { message: "No more comments to load", success: true, comments: [] };
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_COMMENTS_GIVEN_ACTIVITYID_URL + "/" + activityID + "/" + pageNum,
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
  } catch (err) {
    console.log(err);
    return { message: "Something went wrong", success: false };
  }
};


/**
 * @function handleGetSearchResults
 * 
 * @description queries the database for any activity title / description that matches the search string.
 * 
 * @param {string} queryString 
 * @param {number} pageNum 
 * @returns 
 */
export const handleGetSearchResults = async (queryString: string, pageNum: number) => {
  if (!queryString || pageNum < 1) return { message: "No results", success: true, results: [] };
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_SEARCH_RESULTS + "/" + queryString + "/" + pageNum,
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
  } catch (err) {
    console.log(err);
    return { message: "Something went wrong", success: false };
  }
};


/**
 * @function handleGetUserInfo
 * @description gets the user information from the Users table
 * 
 * @param {string} uid the user's ID 
 */
export const handleGetUserInfo = async (uid: string) => {
  if (!uid) return { message: "Incorrect user ID", success: false, info: null };
  try {
    const response = await fetch(
      import.meta.env.VITE_AWS_API_GATEWAY_GET_USER_INFO + "/" + uid,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData: { message: string; success: boolean; info: HumspotUser } = await response.json();
    console.log(responseData);
    return responseData;
  } catch (err) {
    console.log(err);
    return { message: "Something went wrong", success: false, info: null };
  }
};


/**
 * @function handleClickOnReportButton
 * 
 * @param reporterEmail the person reporting
 * @param suspectEmail the person being reported
 * @param details the details of the report
 */
export const handleClickOnReportButton = async (reporterUserID: string, reporterEmail: string | null | undefined, suspectUserID: string, suspectEmail: string | null | undefined, details: string, activityID: string = '') => {
  try {
    if (!reporterEmail) throw new Error("No emails provided to function");
    const res = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_REPORT_USER, {
      method: 'POST',
      body: JSON.stringify({
        reporterUserID: reporterUserID,
        reporterEmail: reporterEmail,
        suspectUserID: suspectUserID,
        suspectEmail: suspectEmail,
        details: details,
        activityID: activityID
      })
    });
    const data: { message: string; success: boolean } = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);
    return { message: err.toString(), success: false };
  }
};


/**
 * @function handleDeleteComment
 * @description Removes a user's comment from the Comments table in the DB.
 * 
 * @param userID 
 * @param commentID 
 * @returns 
 */
export const handleDeleteComment = async (userID: string, commentID: string) => {
  try {
    if (!userID || !commentID) throw new Error('No userID or commentID provided');
    const res = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_DELETE_COMMENT, {
      method: 'POST',
      body: JSON.stringify({
        userID: userID,
        commentID: commentID
      })
    });
    const data: { message: string; success: boolean } = await res.json();
    return data;
  } catch (err: any) {
    console.error(err);
    return { message: err.toString(), success: false };
  }
};


/**
 * 
 * @param blockerUserID 
 * @param blockedUserID 
 * @returns 
 */
export const handleBlockUser = async (blockerUserID: string, blockedUserID: string) => {
  try {
    if (!blockerUserID || !blockedUserID) throw new Error("No userIDs provided");
    const res = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_BLOCK_USER, {
      method: 'POST',
      body: JSON.stringify({
        blockerUserID: blockerUserID,
        blockedUserID: blockedUserID
      })
    });
    const data: { message: string; success: boolean } = await res.json();
    return data;
  } catch (err: any) {
    console.error(err)
    return { message: err.toString(), success: false };
  }
};



export const handleGetIsUserBlocked = async (currentUserID: string, otherUserID: string) => {
  try {
    if (!currentUserID || !otherUserID) throw new Error("No userIDs provided");
    const res = await fetch(import.meta.env.VITE_AWS_API_GATEWAY_GET_IS_USER_BLOCKED, {
      method: 'POST',
      body: JSON.stringify({
        currentUserID: currentUserID,
        otherUserID: otherUserID
      })
    });
    const data: { message: string; success: boolean, isUserBlocked: boolean } = await res.json();
    console.log(data);
    return data;
  } catch (err: any) {
    console.error(err)
    return { message: err.toString(), success: false, isUserBlocked: false };
  }
};