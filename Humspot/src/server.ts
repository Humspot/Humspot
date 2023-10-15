/**
 * @file server.ts
 * @filetype contains the code used to access backend services like Google and AWS.
 */

import awsconfig from './aws-exports';
import { Amplify, Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { AWSAddEventResponse, AWSLoginResponse, HumspotEvent } from './types';

Amplify.configure(awsconfig);


/**
 * @function handleGoogleLoginAndVerifyAWSUser
 * @description handles login through Google. If successful, the user will be created in AWS IdentityPool.
 * 
 * @returns {Promise<boolean>} whether the auth federated sign in (GOOGLE) is successful/
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
    console.log("handling add event");  
    const currentUserSession = await Auth.currentSession();

    if (!(currentUserSession.isValid())) throw new Error('Invalid auth session');

    const idToken = currentUserSession.getIdToken();
    const jwtToken = idToken.getJwtToken();

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



