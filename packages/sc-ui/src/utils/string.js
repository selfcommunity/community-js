export function stripHtml(str) {
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
    let successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.success();
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
