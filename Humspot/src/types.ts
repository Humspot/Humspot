/**
 * @file types.ts
 * @filedescription contains the types used throughout the application
 */

export type HumspotUser = {
  userID: string;
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

export type AWSAddEventResponse = {
  message: string;
  eventID?: string;
}

export type HumspotEvent = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  lat: number;
  lng: number;
  organizer: string;
  tags: string[];
};