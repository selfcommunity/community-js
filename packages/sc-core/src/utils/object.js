import t from 'typy';

/**
 * Perfrom deep merge of two objects (not a shallow merge)
 * @param target
 * @param source
 * @return {*}
 */
export function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (t(target).isObject && t(source).isObject) {
    Object.keys(source).forEach((key) => {
      if (t(source[key]).isObject) {
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
