import React, { useEffect, useLayoutEffect } from "react";
import {useIsComponentMountedRef} from '@selfcommunity/react-core';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes current height and
 * update virtual scroll
 */
const VirtualScrollChild = ({virtualScrollerMountState, children, onHeightChange}) => {
  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // Ensure that the SSR uses React.useEffect instead of React.useLayoutEffect
  // because document is undefined on the server-side.
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (virtualScrollerMountState.current && isMountedRef.current) {
      onHeightChange();
    }
  }, [isMountedRef]);

  return <div>{children}</div>;
};

export default VirtualScrollChild;
