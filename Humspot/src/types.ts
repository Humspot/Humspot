/**
 * @file types.ts
 * @filedescription contains the types used throughout the application
 */

export type HumspotUser = {
  userId: string;
  email: string | null;
  imageUrl: string;
  awsUsername: string | null;
  accountType: 'user' | 'admin' | 'organizer' | 'guest';
  accountStatus: 'active' | 'restricted';
  authProvider: 'google' | 'custom'
  dateCreated: string | Date;
}

export type AWSLoginResponse = {
  message: string;
  user?: HumspotUser;
}