/**
 * The period a leaderboard refers to
 */
export type LeaderboardPeriod = 'week' | 'month' | 'year';

/**
 * Formats the given date as `yyyy-MM-dd` (in the local timezone)
 * @param date
 */
function formatDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Computes the (inclusive) reputation date range the given period refers to
 * @param period
 */
export function getPeriodRange(period: LeaderboardPeriod): {reputed_at_from: string; reputed_at_to: string} {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  let from: Date;
  let to: Date;

  switch (period) {
    case 'week': {
      // Weeks start on monday
      const weekDay = (now.getDay() + 6) % 7;
      from = new Date(year, month, day - weekDay);
      to = new Date(year, month, day - weekDay + 6);
      break;
    }
    case 'year':
      from = new Date(year, 0, 1);
      to = new Date(year, 11, 31);
      break;
    default:
      from = new Date(year, month, 1);
      to = new Date(year, month + 1, 0);
      break;
  }

  return {reputed_at_from: formatDate(from), reputed_at_to: formatDate(to)};
}
