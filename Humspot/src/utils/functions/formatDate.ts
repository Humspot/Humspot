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

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const day = date.getUTCDate();
  const monthIndex = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

export const extractDateFromSqlDatetime = (datetimeStr: string): string => {
  // Create a Date object from the datetime string
  const dateObj = new Date(datetimeStr);

  // Extract the year, month, and day
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1; // getMonth() returns 0-11
  const day = dateObj.getDate();

  // Format the month and day to ensure two digits
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');

  // Construct and return the date string in 'YYYY-MM-DD' format
  return `${year}-${formattedMonth}-${formattedDay}`;
};
