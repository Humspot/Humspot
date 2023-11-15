/**
 * @file formatDate.ts
 * @fileoverview contains function formatDate which takes in the DATE type fom mySQL and convert
 * it to a formatted and readable date string.
 */

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
};
