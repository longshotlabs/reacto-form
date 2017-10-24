/**
 * Convert a Date instance to an object with properties for the various pieces
 *
 * @param {Function} propsFunc - Takes in element and returns a props object
 * @param {Moment} moment - An instance of moment.tz
 * @param {String} timezone - A timezone identifier
 */
export default function getDateTimeValuesFromDate(date, moment, timezone) {
  if (!date || !(date instanceof Date) || !moment || typeof timezone !== 'string') {
    // The defaults have to be "" rather than undefined or null so that React knows they are "controlled" inputs
    return {
      dayValue: '',
      monthValue: '',
      timeValue: '',
      yearValue: '',
    };
  }
  const m = moment(date).tz(timezone);
  return {
    dayValue: m.format('DD'),
    monthValue: m.format('M'),
    timeValue: m.format('HH:mm'),
    yearValue: m.format('YYYY'),
  };
}
