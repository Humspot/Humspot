/**
 * @file types.ts
 * @filedescription contains the types used throughout the application
 */

export type HumspotUser = {
  email: string | null;
  imageUrl: string;
  awsUsername: string | null;
  loggedIn: boolean;
  role: 'user' | 'admin' | 'organizer' | 'guest';
}