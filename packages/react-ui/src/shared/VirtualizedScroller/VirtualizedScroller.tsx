import React, {useEffect, useMemo, useRef} from 'react';
import {CacheStrategies, LRUCache} from '@selfcommunity/utils';
import VirtualScroller from 'virtual-scroller/react';

/**
 * VirtualizedScroller
 * A component for efficiently rendering large lists of variable height items.
 * VirtualScroller works by measuring each list item's height as it's being rendered, and then, as the user scrolls,
 * it hides the items that are no longer visible, and shows the now-visible items as they're scrolled to.
 * The hidden items at the top are compensated by setting padding-top on the list element, and the hidden items
 * at the bottom are compensated by setting padding-bottom on the list element.
 * The component listens to scroll / resize events and re-renders the currently visible items as the user
 * scrolls (or if the browser window is resized).
 * Set window.VirtualScrollerDebug to true to output debug messages to console.
 */
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

  /**
   * Read virtual scroller state
   */
  const readVirtualScrollerState = useMemo(
    () => (): number => {
      if (cacheStrategy === CacheStrategies.CACHE_FIRST && cacheScrollStateKey && LRUCache.hasKey(cacheScrollStateKey)) {
        const _state = LRUCache.get(cacheScrollStateKey);
        if (_state.items && _state.items.length) {
          return _state;
        }
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
