import React from 'react';
import {useInView} from 'react-intersection-observer';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes inline style and
 * handles whether to display props.children.
 */
function VirtualScrollChild({children}) {
  const [ref, inView] = useInView();
  return <div ref={ref}>{inView ? children : null}</div>;
}

export default VirtualScrollChild;
