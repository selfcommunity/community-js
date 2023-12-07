/**
 * Check if v is an integer number
 * @param v
 */
export function isInteger(v) {
  return !isNaN(v) && parseInt(String(Number(v))) == v && !isNaN(parseInt(String(v), 10));
}
