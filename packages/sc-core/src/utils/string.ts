/**
 * Check if v is a string
 * @param v
 */
export function isString(v) {
  return typeof v === 'string' || v instanceof String;
}

/**
 * Capitalize a string
 * @param str
 */
export function capitalize(str: string): string {
  let strVal = '';
  let strArr: string[] = str.split(' ');
  for (let chr = 0; chr < strArr.length; chr++) {
    strVal += strArr[chr].substring(0, 1).toUpperCase() + strArr[chr].substring(1, strArr[chr].length);
  }
  return strVal;
}

/**
 * CamelCase a string
 * @param str
 */
export function camelCase(str: string): string {
  // Lower cases the string
  return (
    str
      .toLowerCase()
      // Replaces any - or _ characters with a space
      .replace(/[-_]+/g, ' ')
      // Removes any non alphanumeric characters
      .replace(/[^\w\s]/g, '')
      // Uppercases the first character in each group immediately following a space
      // (delimited by spaces)
      .replace(/ (.)/g, ($1) => {
        return $1.toUpperCase();
      })
      // Removes spaces
      .replace(/ /g, '')
  );
}

/**
 * Stripe html tags from a string
 * @param str
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>?/gm, '').trim();
}
