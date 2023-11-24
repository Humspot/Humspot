
const ratingQuery: string = `
  SELECT rating 
  FROM ActivityRatings 
  WHERE activityID = ? AND userID = ?;
`;

const [ratingRows]: any = await conn.execute(ratingQuery, [activityId, userId]);
const userRating = ratingRows.length > 0 ? ratingRows[0].rating : null;
const hasRated = ratingRows.length > 0;

// Add the userHasRated attribute to the activity object
activity.userHasRated = {
  rating: userRating,
  hasRated: hasRated
};