/**
 * Check if two arrays are equal
 * @param a
 * @param b
 * @return boolean
 */
export const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * Group items from an array together by some criteria or value.
 * @param  {Array}           arr      The array to group items from
 * @param  {String|Function} criteria The criteria to group by
 * @return {Object}                   The grouped object
 */
export const groupBy = (arr, criteria) => {
  return arr.reduce(function (obj, item) {
    // Check if the criteria is a function to run on the item or a property of it
    let key = typeof criteria === 'function' ? criteria(item) : item[criteria];

    // If the key doesn't exist yet, create it
    // eslint-disable-next-line no-prototype-builtins
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }

    // Push the value to the object
    obj[key].push(item);

    // Return the object to the next item in the loop
    return obj;
  }, {});
};

/**
 * Sort an array of objects by attr.
 * @param arr The array to group items from
 * @param attr Order attribute
 * @param asc Sort asc/desc
 */
export const sortByAttr = (arr, attr, asc = true) => {
  if (!Array.isArray(arr)) {
    return arr;
  }
  const f = asc
    ? (a: Record<string, any>, b: Record<string, any>) => a[attr] - b[attr]
    : (a: Record<string, any>, b: Record<string, any>) => b[attr] - a[attr];
  return arr.sort(f);
};
