import {useRef, useEffect, DependencyList} from 'react';

const useEffectOnce = (callback, when: DependencyList) => {
  const hasRunOnce = useRef(false);
  useEffect(() => {
    if (when && !hasRunOnce.current) {
      callback();
      hasRunOnce.current = true;
    }
  }, [when]);
};
export default useEffectOnce;
