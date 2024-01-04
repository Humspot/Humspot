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


export function checkEventDate(dateString: string): string {
  // Create date objects for the event date and the current date
  const eventDate = new Date(dateString);
  const currentDate = new Date();

  // Set both dates to start of the day for accurate comparison
  eventDate.setUTCHours(0, 0, 0, 0);
  currentDate.setUTCHours(0, 0, 0, 0);

  // Compare the dates to determine the time relation
  if (eventDate.getTime() === currentDate.getTime()) {
      return 'is today';
  } else if (eventDate < currentDate) {
      return 'already happened';
  } else {
      // Format the date as "Month Day, Year" for the return string
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const futureDate = eventDate.toLocaleDateString(undefined, options);
      return `happening on ${futureDate}`;
  }
}