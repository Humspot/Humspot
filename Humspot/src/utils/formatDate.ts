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

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const seconds = date.getSeconds();

  return `${monthNames[monthIndex]} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${amOrPm}`;
};
