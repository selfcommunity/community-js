import React, {useEffect} from 'react';
import {useInView} from 'react-intersection-observer';
/**
 * A container component for infinite scrolling.
 */
function InfiniteScroll({elements, lastRowHandler, skeleton}) {
  const [lastRowRef, lastRowInView] = useInView();

  // if last row is in view, call the last row handler
  useEffect(() => {
    if (lastRowInView) {
      lastRowHandler && lastRowHandler();
    }
  }, [lastRowInView]);

  return (
    <>
      {elements}
      <div ref={lastRowRef}>{skeleton}</div>
    </>
  );
}

export default InfiniteScroll;
