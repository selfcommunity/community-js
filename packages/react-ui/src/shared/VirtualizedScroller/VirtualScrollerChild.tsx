import React from 'react';
import {useIsComponentMountedRef} from '@selfcommunity/react-core';
import useResizeObserver from 'use-resize-observer';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes current height and
 * update virtual scroll.
 */
const VirtualScrollChild = ({children, onHeightChange}) => {
  // REFS
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Use useResizeObserver to intercept layout change:
   * onResize callback function, receive the width and height of the
   * element when it changes and call onHeightChange
   * It does not cover all possible cases, so all elements that can be
   * included in the feed must implement the interface VirtualScrollerItemProps
   */
  const {ref} = useResizeObserver<HTMLDivElement>({
    onResize: ({width, height}) => {
      if (isMountedRef.current) {
        onHeightChange && onHeightChange();
      }
    }
  });

  return <div ref={ref}>{children}</div>;
};

export default VirtualScrollChild;
