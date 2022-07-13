/**
 * Compare widget priority
 * @param w1
 * @param w2
 */
export const widgetSort = (w1, w2) => (w1.position > w2.position ? 1 : -1);

/**
 * Insert widget in the correct position of feed
 * @param value
 * @param w
 */
export const widgetReducer = (total, limit) => (value, w) => {
  if (w.position < value.length || total < limit) {
    value.splice(w.position, 0, w);
  }
  return value;
};
