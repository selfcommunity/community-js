import {useEffect, useRef} from 'react';

/**
 * If for some reason you can't cleanup or clear the timeouts properly,
 * you can use the following hook to verify just before setting state
 * if the component is still mounted.
 * Usage:
 * import {useIsComponentMountedRef} from '@selfcommunity/react-core';
 *
 * const MyComponent = () => {
 *   const isMountedRef = useIsComponentMountedRef();
 *   // ex: isMountedRef.current && setState(...)
 * };
 */
const useIsComponentMountedRef = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

export default useIsComponentMountedRef;
