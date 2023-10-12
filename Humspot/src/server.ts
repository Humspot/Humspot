/**
 * @file server.ts
 * @filetype contains the code used to access backend services like Google and AWS.
 */

import { GoogleAuth, User } from '@codetrix-studio/capacitor-google-auth';
import * as AWS from 'aws-sdk/global';
import { GoogleAndAWSVerifyResult, HumspotUser } from './types';
import { Preferences } from '@capacitor/preferences';

AWS.config.update({
  region: 'us-west-1',
});

export const setGuestUser = () => {
  const credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
  });
  AWS.config.credentials = credentials;
}

/**
 * @function handleGoogleLoginAndVerifyAWSUser
 * @description handles login through Google. If successful, the user will be created in AWS IdentityPool.
 * 
 * @returns {Promise<GoogleAndAWSVerifyResult>} whether the google login succeeded, and, if so, 
 * whether the AWS user was successfully created. If both are true, return the access key ID from AWS.
 */
export const handleGoogleLoginAndVerifyAWSUser = (): Promise<GoogleAndAWSVerifyResult> => {
  return new Promise(async (resolve) => {
    try {
      const user: User = await GoogleAuth.signIn();

      // Get google account info
      const idToken: string = user.authentication.idToken;
      const email: string = user.email;
      const imageUrl: string = user.imageUrl;
      const name: string = user.name;

      // Check for AWS Identity Pool config
      const credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID,
        Logins: {
          'accounts.google.com': idToken
        },
      });

      credentials.expired = true;

      AWS.config.credentials = credentials;

      credentials.get((error) => {
        if (error) {
          console.error(error);
          resolve({ success: false });
          return;
        }

        // If no error, create frontend HumspotUser
        const User: HumspotUser = {
          email: email,
          imageUrl: imageUrl,
          username: name,
          accessKeyId: credentials.accessKeyId,
          loggedIn: true
        };
        resolve({ success: true, user: User });
      });
    } catch (err) {
      console.error(err);
      resolve({ success: false });
    }
  });
};

/**
 * @function handleAWSLogout
 * @description Handles the logout of AWS and clears the access key ID from cache.
 * 
 * @returns {Promise<true | undefined>} true if logout success, otherwise error

 */
export const handleAWSLogout = async (): Promise<true | undefined> => {
  try {
    if (AWS.config.credentials instanceof AWS.CognitoIdentityCredentials) {
      AWS.config.credentials.clearCachedId();
      AWS.config.credentials.expired = true;
    }

    const defaultCredentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: import.meta.env.VITE_AWS_IDENTITY_POOL_ID
    });
    AWS.config.credentials = defaultCredentials;

    await Preferences.remove({ key: 'humspotUser' });
    return true;

  } catch (error) {
    console.error('Error logging out from AWS', error);
  }
};

/**
 * @function handleGoogleLogout
 * @description Handles the logout of Google.
 * 
 * @returns {Promise<true | undefined>} true if logout success, otherwise error
 */
export const handleGoogleLogout = async (): Promise<true | undefined> => {
  try {
    await GoogleAuth.signOut();
    return true;
  } catch (error) {
    console.error('Error logging out from Google', error);
  }
};




