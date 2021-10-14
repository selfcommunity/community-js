export function capitalize(str) {
  let strVal = '';
  str = str.split(' ');
  for (let chr = 0; chr < str.length; chr++) {
    strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length);
  }
  return strVal;
}

export function camelCase(str) {
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

export function stripHtml(str) {
  return str.replace(/<[^>]*>?/gm, '').trim();
}
