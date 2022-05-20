/**
 * Check if v is an object
 * @param v
 */
export function isObject(v) {
  return typeof v === 'object' && !Array.isArray(v) && v !== null;
}

/**
 * Perfrom deep merge of two objects (not a shallow merge)
 * @param target
 * @param source
 * @return {*}
 */
export function mergeDeep(target: object, source: object): object {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, {[key]: source[key]});
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    });
  }
  return output;
}
