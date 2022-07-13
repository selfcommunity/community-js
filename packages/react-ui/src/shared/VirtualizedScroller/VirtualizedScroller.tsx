import React, {useEffect, useMemo, useRef} from 'react';
import {CacheStrategies, LRUCache} from '@selfcommunity/utils';
import VirtualScroller from 'virtual-scroller/react';

export default function VirtualizedScroller(props): JSX.Element {
  const {
    items = [],
    ItemComponent,
    getItemId,
    initialScrollerState,
    onScrollerStateChange,
    onScrollerMount,
    onScrollerPositionChange,
    onScrollerSaveState,
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    cacheScrollStateKey = 'virtual_scroller_st',
    cacheScrollerPositionKey = 'virtual_scroller_sp',
    ...rest
  } = props;

  // REF
  const virtualScrollerMountState = useRef(false);

  // HELPERS

  /**
   * Callback on mount the virtual scroller
   */
  const onVirtualScrollerMount = useMemo(
    () => () => {
      virtualScrollerMountState.current = true;
      onScrollerMount && onScrollerMount();
    },
    []
  );

  /**
   * Get initial scroll position by cacheScrollerPositionKey
   * Recovered only if cacheStrategy = CACHE_FIRST
   */
  const getInitialScrollPosition = useMemo(
    () => () => cacheStrategy === CacheStrategies.CACHE_FIRST && cacheScrollerPositionKey ? LRUCache.get(cacheScrollerPositionKey) : 0,
    [cacheStrategy, cacheScrollerPositionKey]
  );

  /**
   * Callback on virtual scroller position change
   */
  const onScrollPositionChange = useMemo(
    () => (y) => {
      if (cacheScrollerPositionKey) {
        LRUCache.set(cacheScrollerPositionKey, y);
      }
      onScrollerPositionChange && onScrollerPositionChange(y);
    },
    [cacheScrollerPositionKey]
  );

  /**
   * Callback on virtual scroller state change
   */
  const onStateScrollChange = useMemo(
    () => (state) => {
      virtualScrollerState.current = state;
      onScrollerStateChange && onScrollerStateChange(state);
    },
    []
  );

  /**
   * Save virtual scroller state
   */
  const saveVirtualScrollerState = useMemo(
    () =>
      (state): void => {
        if (cacheScrollerPositionKey) {
          LRUCache.set(cacheScrollStateKey, state);
        }
        onScrollerSaveState && onScrollerSaveState(state);
      },
    [cacheScrollStateKey]
  );
  const readVirtualScrollerState = useMemo(
    () => (): number => {
      if (cacheStrategy === CacheStrategies.CACHE_FIRST && cacheScrollStateKey) {
        return LRUCache.get(cacheScrollStateKey);
      }
      return null;
    },
    [cacheScrollStateKey, cacheStrategy]
  );

  // REF
  const virtualScrollerState = useRef(readVirtualScrollerState());

  // EFFECTS
  useEffect(() => {
    return () => {
      // Save state before the component unmounts.
      saveVirtualScrollerState(virtualScrollerState.current);
    };
  });

  return (
    <VirtualScroller
      items={items}
      itemComponent={ItemComponent}
      onMount={onVirtualScrollerMount}
      {...(getItemId && {getItemId})}
      initialState={initialScrollerState ? initialScrollerState : readVirtualScrollerState()}
      onStateChange={onStateScrollChange}
      initialScrollPosition={getInitialScrollPosition()}
      onScrollPositionChange={onScrollPositionChange}
      {...rest}
    />
  );
}
