export function stripHtml(str) {
  return str.replace(/<[^>]*>?/gm, '').trim();
}

export function random() {
  return (Math.random() + 1).toString(36).substring(7);
}
