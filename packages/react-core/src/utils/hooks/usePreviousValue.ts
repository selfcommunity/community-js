import {useEffect, useRef} from 'react';

/**
 * Get previous props value with React Hooks
 * @param value
 *
 * Usage:
 * import {usePreviousValue} from '@selfcommunity/react-core';
 *
 * const MyComponent = ({ count }) => {
 *    const prevCount = usePreviousValue(count);
 *    return (<div> {count} | {prevCount}</div>);
 * }
 */
const usePreviousValue = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePreviousValue;
