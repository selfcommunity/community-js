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

export function random() {
  return (Math.random() + 1).toString(36).substring(7);
}

/**
 * Fallback if navigator.clipboard doensn't exist
 * @param text
 * @returns {Promise<void>}
 */
export function fallbackCopyTextToClipboard(text) {
  let textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
}

/**
 * Copy text to clipboard
 * @param text
 * @returns {Promise<void>}
 *
 * Ex.
 * copyTextToClipboard(text).then(
 *    function () {
 *     console.log('Async: Copying to clipboard was successful!');
 *   },
 *   function (err) {
 *     console.error('Async: Could not copy text: ', err);
 *   });
 */
export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  return navigator.clipboard.writeText(text);
}
