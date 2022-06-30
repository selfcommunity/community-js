export function generateString() {
  return Math.random().toString(36).substring(7);
}

export function getRandomInt() {
  return Math.floor(Math.random() * (10000 - 0) + 0);
}

export function generateEmail() {
  let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let string = '';
  for (let ii = 0; ii < 15; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return string + '@gmail.com';
}
