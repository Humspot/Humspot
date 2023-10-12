/**
 * @file types.ts
 * @filedescription contains the types used throughout the application
 */

export type HumspotUser = {
  accessKeyId: string; // AWS
  email: string;
  imageUrl: string; 
  username: string;
  loggedIn: boolean;
}

export type GoogleAndAWSVerifyResult = {
  success: boolean;
  user?: HumspotUser;
};