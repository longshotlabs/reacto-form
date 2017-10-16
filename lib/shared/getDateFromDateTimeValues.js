const oneOrTwoDigits = /^\d{1,2}$/;
const upToFourDigits = /^\d{1,4}$/;
const timeFormat = /^\d{1,2}:\d{2}$/;

/**
 * Convert a Date instance to an object with properties for the various pieces
 *
 * @param {Object} obj - Object with properties for date/time pieces
 * @param {Moment} moment - An instance of moment.tz
 * @param {String} timezone - A timezone identifier
 */
export default function getDateFromDateTimeValues(obj, moment, timezone) {
  if (!moment || typeof timezone !== 'string') return null;
  const { dayValue, monthValue, timeValue, yearValue } = obj;
  if (typeof dayValue !== 'string' || !dayValue.match(oneOrTwoDigits)) return null;
  if (typeof monthValue !== 'string' || !monthValue.match(oneOrTwoDigits) || Number(monthValue) > 12 || Number(monthValue) < 1) return null;
  if (typeof timeValue !== 'string' || !timeValue.match(timeFormat)) return null;
  if (typeof yearValue !== 'string' || !yearValue.match(upToFourDigits)) return null;

  const dateString = `${yearValue}-${monthValue}-${dayValue} ${timeValue}`;
  return moment.tz(dateString, 'YYYY-M-DD H:mm', timezone).toDate();
}
