export const getRelativeTime = (date) => {
  const diffInMilliseconds = new Date().getTime() - new Date(date).getTime();
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return {value: years, unit: 'year'};
  } else if (months > 0) {
    return {value: months, unit: 'month'};
  } else if (weeks > 0) {
    return {value: weeks, unit: 'week'};
  } else if (days > 0) {
    return {value: days, unit: 'day'};
  } else if (hours > 0) {
    return {value: hours, unit: 'hour'};
  } else if (minutes > 0) {
    return {value: minutes, unit: 'minute'};
  } else {
    return {value: seconds, unit: 'second'};
  }
};
