import React, {useEffect} from 'react';
import {useInView} from 'react-intersection-observer';
import {LRUCache} from '@selfcommunity/utils';
import {SCCache} from '@selfcommunity/react-core';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes inline style and
 * handles whether to display props.children.
 */
function VirtualScrollChild({cacheKey, index, children}) {
  const [ref, inView] = useInView({threshold: 0.5});

  useEffect(() => {
    if (inView) {
      LRUCache.set(SCCache.getFeedSPCacheKey(cacheKey), index);
    }
  }, [inView]);

  return <div ref={ref}>{children}</div>;
}

export default VirtualScrollChild;
