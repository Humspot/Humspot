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
  requestForCoordinatorSubmitted: number;
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

export type GetHumspotEventResponse = {
  eventID: string;
  activityID: string;
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  date: string;
  time: string;
  latitude: string | null;
  longitude: string | null;
  websiteURL: string;
  organizer: string;
  tags: string | null;
  photoUrl: string | null;
}

export type HumspotAttraction = {
  name: string;
  description: string;
  location: string;
  addedByUserID: string;
  latitude: number | null;
  longitude: number | null;
  websiteURL: string;
  organizer: string;
  openTimes: string | null;
  tags: string[];
  photoUrls: string[] | null;
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

export type GetEventsGivenTagResponse = {
  message: string;
  events:
  (HumspotEvent & {
    eventID: string;
    activityID: string;
    activityType: string;
    tagID: string;
    tagName: string;
  })[];
};

export type AddImageResponse = {
  success: boolean;
  message?: string;
  photoUrl: string;
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
  // commentDate: string;
  userID: string;
  activityID: string;
  photoUrl: string | null;
};

export type HumspotInteractionResponse = {
  activityID: string;
  interactionDate: string;
  interactionID: string;
  interactionText: string | null; // string if comment, null if RSVP
  interactionType: "rsvp" | "comment";
  name: string;
  photoUrl: string | null;
};

export type GetInteractionsResponse = {
  message: string;
  success: boolean;
  interactions: HumspotInteractionResponse[];
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
  websiteURL: string;
  date: string;
  time: string;
  latitude: string | null;
  longitude: string | null;
  tags: string; // comma delimited list
  photoUrls: string; // comma delimited list
  organizer: string;
  openTimes: string | null;
  comments: any[];
  avgRating: number;
}

export type GetFavoritesAndVisitedAndRSVPStatusResponse = {
  success: boolean;
  message: string;
  favorited: boolean | null;
  visited: boolean | null;
  rsvp: boolean | null;
}

export type GetEventsBetweenTwoDatesStatusResponse = {
  message: string;
  events: (HumspotEvent & {
    eventID: string;
    activityID: string;
    activityType: string;
    tagID: string;
    tagName: string;
  })[];
  success: boolean;
};

export type AddCommentImageResponse = {
  message: string;
  success: boolean;
  uploadUrl: string;
  bucketName: string;
  region: string;
  key: string;
};

export type SubmittedActivities = {
  submissionID: string;
  name: string;
  activityType: string;
  description: string;
  submissionDate: string;
};

export type GetSubmittedActivitiesResponse = {
  message: string;
  success: boolean;
  submittedActivities: SubmittedActivities[];
};


export type OrganizerRequestSubmission = {
  userID: string;
  name: string;
  email: string;
  description: string;
};

export type SubmissionInfo = {
  activityType: "event" | "attraction" | "custom"
  addedByUserID: string;
  date: string | null;
  description: string;
  latitude: string | null;
  longitude: string | null;
  location: string;
  name: string;
  openTimes: string | null;
  organizer: string;
  photoUrls: string | null;
  submissionDate: string | null;
  submissionID: string;
  tagNames: string | null;
  time: string | null;
  websiteURL: string | null;
};