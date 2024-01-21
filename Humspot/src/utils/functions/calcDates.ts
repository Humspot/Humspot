export function getDateStrings() {
  // Get today's date
  const today = new Date();
  // Get the date tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Get the date 7 days from now
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  // Get the date 8 days from now
  const eightDaysFromNow = new Date();
  eightDaysFromNow.setDate(today.getDate() + 8);

  // Get the date 30 days from now
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);


  // Format dates as strings
  const todayString = dateCalcFormat(today);
  const tomorrowString = dateCalcFormat(tomorrow);
  const sevenDaysFromNowString = dateCalcFormat(sevenDaysFromNow);
  const eightDaysFromNowString = dateCalcFormat(eightDaysFromNow);
  const thirtyDaysFromNowString = dateCalcFormat(thirtyDaysFromNow);

  // Return the result as an object
  return {
    today: todayString,
    tomorrow: tomorrowString,
    sevenDaysFromNow: sevenDaysFromNowString,
    eightDaysFromNow: eightDaysFromNowString,
    thirtyDaysFromNow: thirtyDaysFromNowString
  };
}

// Helper function to format date as "YYYY-MM-DD"
function dateCalcFormat(date: any) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function isPastDate(dateString: string): boolean {
  if (!dateString) return true;

  const eventDate = new Date(dateString);
  eventDate.setHours(0, 0, 0, 0);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  return eventDate < currentDate;
};