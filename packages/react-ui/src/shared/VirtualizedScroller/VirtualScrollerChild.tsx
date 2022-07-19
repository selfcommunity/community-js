import React, {useLayoutEffect} from 'react';
import {useIsComponentMountedRef} from '@selfcommunity/react-core';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes current height and
 * update virtual scroll
 */
const VirtualScrollChild = ({virtualScrollerMountState, children, onHeightChange}) => {
  // REFS
  const isMountedRef = useIsComponentMountedRef();

  useLayoutEffect(() => {
    if (virtualScrollerMountState.current && isMountedRef.current) {
      onHeightChange();
    }
  }, [isMountedRef]);

  return <div>{children}</div>;
};

export default VirtualScrollChild;
