import {useRef, EffectCallback, DependencyList, useEffect} from 'react';

/**
 * @param effect
 * @param dependancies
 * @description Hook to prevent running the useEffect on the first render
 */
const useNoInitialEffect = (effect: EffectCallback, dependancies?: DependencyList) => {
  // Preserving the true by default as initial render cycle
  const initialRender = useRef(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let effectReturns: void | (() => void) = () => {};

    /**
     * Updating the ref to false on the first render, causing
     * subsequent render to execute the effect
     */
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      effectReturns = effect();
    }

    /**
     * Preserving and allowing the Destructor returned by the effect
     * to execute on component unmount and perform cleanup if
     * required.
     */
    if (effectReturns && typeof effectReturns === 'function') {
      return effectReturns;
    }
    return undefined;
  }, dependancies);
};

export default useNoInitialEffect;
