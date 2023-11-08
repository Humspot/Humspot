/**
 * @file types.ts
 * @fileoverview contains the types used throughout the application
 */

export type HumspotUser = {
  userID: string;
  email: string | null;
  profilePicURL: string;
  awsUsername: string | null;
  accountType: "user" | "admin" | "organizer" | "guest";
  accountStatus: "active" | "restricted";
  authProvider: "google" | "custom";
  dateCreated: string;
  username?: string;
  bio: string;
};

export type HumspotEvent = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  latitude: number | null;
  longitude: number | null;
  websiteURL: string;
  organizer: string;
  tags: string[];
  photoUrls: string[];
};

export type HumspotAttraction = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  websiteUrl: string;
  latitude: number | null;
  longitude: number | null;
  openTimes: string;
  tags: string[];
  photoUrls: string[];
};

export type LoginResponse = {
  message: string;
  user?: HumspotUser;
};

export type AddEventResponse = {
  message: string;
  eventID?: string;
};

export type AddAttractionResponse = {
  message: string;
  attractionID?: string;
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

export type GetEventsGivenTagResponse = {
  message: string;
  events: ExtendedHumspotEvent[];
};

export type AddImageResponse = {
  success: boolean;
  message?: string;
  photoUrls: string[];
};

export type AddToFavoritesResponse = {
  message: string;
  success: boolean;
  favoriteID?: string;
  removed?: boolean;
};

export type AddToVisitedResponse = {
  message: string;
  success: boolean;
  visitedID?: string;
  removed?: boolean;
};

export type AddToRSVPResponse = {
  message: string;
  success: boolean;
  RSVPID?: string;
  removed?: boolean;
};

export type HumspotCommentSubmit = {
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
  photoUrl: string | null;
};

export type GetCommentsResponse = {
  message: string;
  success: boolean;
  comments: HumspotCommentResponse[];
};

export type HumspotFavoriteResponse = {
  activityID: string | null;
  activityType: 'event' | 'attraction' | 'custom';
  name: string;
  description: string;
  location: string;
  photoUrl: string | null;
};

export type HumspotVisitedResponse = {
  activityID: string | null;
  activityType: 'event' | 'attraction' | 'custom';
  name: string;
  description: string;
  location: string;
  photoUrl: string | null;
};

export type GetFavoritesResponse = {
  message: string;
  success: boolean;
  favorites: HumspotFavoriteResponse[];
}

export type AddCommentResponse = {

};

export type GetActivityResponse = {
  message: string;
  success: boolean;
  activity?: HumspotActivity;
};

export type HumspotActivity = {
  name: string;
  description: string;
  location: string;
  activityType: "event" | "attraction" | "custom";
  websiteUrl: string;
  date: string;
  time: string;
  latitude: string | null;
  longitude: string | null;
  tags: string; // comma delimited list
  photoUrls: string; // comma delimited list
  organizer: string;
  openTimes: string | null;
  comments: any[];
}