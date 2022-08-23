/**
 * Calculate current page from url (offset)
 */
export function getCurrentPage(url, pageSize) {
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  const currentOffset: number = params.offset ? parseInt(params.offset) : 0;
  return currentOffset / pageSize + 1;
}
