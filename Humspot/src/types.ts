/**
 * @file types.ts
 * @filedescription contains the types used throughout the application
 */

export type HumspotUser = {
  userID: string;
  email: string | null;
  profilePicURL: string;
  awsUsername: string | null;
  accountType: "user" | "admin" | "organizer" | "guest";
  accountStatus: "active" | "restricted";
  authProvider: "google" | "custom";
  dateCreated: string | Date;
  username?: string;
};

export type AWSLoginResponse = {
  message: string;
  user?: HumspotUser;
};

export type AWSAddEventResponse = {
  message: string;
  eventID?: string;
};

export type HumspotEvent = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  organizer: string;
  tags: string[];
  photoUrls: string[];
};

export type AWSAddAttractionResponse = {
  message: string;
  attractionID?: string;
};

export type HumspotAttraction = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  websiteUrl: string;
  latitude: number;
  longitude: number;
  openTimes: string;
  tags: string[];
  photoUrls: string[];
};

type ExtendedHumspotEvent = HumspotEvent & {
  eventID: string;
  activityID: string;
  activityType: string;
  tagID: string;
  tagName: string;
};

type ExtendedHumspotAttraction = HumspotAttraction & {
  eventID: string;
  activityID: string;
  activityType: string;
  tagID: string;
  tagName: string;
};

export type AWSGetEventsGivenTagResponse = {
  message: string;
  events: ExtendedHumspotEvent[];
};

export type AWSAddImageResponse = {
  success: boolean;
  photoUrls: string[];
};

export type AWSAddToFavoritesResponse = {
  message: string;
  favoriteID?: string;
};

export type AWSAddToVisitedResponse = {
  message: string;
  visitedID?: string;
};

export type HumspotComment = {
  commentText: string;
  commentDate: string;
  userID: string;
  activityID: string;
};

export type HumspotCommentResponse = {
  commentText: string;
  commentDate: string;
  activityID: string;
  name: string;
};

export type AWSGetCommentsResponse = {
  message: string;
  comments?: HumspotCommentResponse[];
};
