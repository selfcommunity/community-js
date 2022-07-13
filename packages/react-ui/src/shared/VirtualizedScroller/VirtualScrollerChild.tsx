import React, {useLayoutEffect} from 'react';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes current height and
 * update virtual scroll
 */
const VirtualScrollChild = ({virtualScrollerMountState, children, onHeightChange}) => {
  useLayoutEffect(() => {
    if (virtualScrollerMountState.current) {
      onHeightChange();
    }
  }, []);

  return <div>{children}</div>;
};

export default VirtualScrollChild;
