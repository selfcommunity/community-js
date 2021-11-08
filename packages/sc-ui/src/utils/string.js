export function stripHtml(str) {
  return str.replace(/<[^>]*>?/gm, '').trim();
}
