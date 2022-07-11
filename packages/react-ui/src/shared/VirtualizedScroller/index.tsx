import React, {useEffect, useMemo, useRef} from 'react';
import {styled} from '@mui/material/styles';
import {CacheStrategies, LRUCache} from '@selfcommunity/utils';
import VirtualScroller from 'virtual-scroller/react';

const PREFIX = 'SCVirtualizedScroller';

const Root = styled('div', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

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

  const onVirtualScrollerMount = useMemo(
    () => () => {
      virtualScrollerMountState.current = true;
      onScrollerMount && onScrollerMount();
    },
    []
  );

  const getInitialScrollPosition = useMemo(
    () => () => cacheStrategy === CacheStrategies.CACHE_FIRST && cacheScrollerPositionKey ? LRUCache.get(cacheScrollerPositionKey) : 0,
    [cacheStrategy, cacheScrollerPositionKey]
  );

  const onStateScrollChange = useMemo(
    () => (state) => {
      virtualScrollerState.current = state;
      onScrollerStateChange && onScrollerStateChange(state);
    },
    []
  );

  const onScrollPositionChange = useMemo(
    () => (y) => {
      if (cacheScrollerPositionKey) {
        LRUCache.set(cacheScrollerPositionKey, y);
      }
      onScrollerPositionChange && onScrollerPositionChange(y);
    },
    [cacheScrollerPositionKey]
  );

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
      // Save `VirtualScroller` state before the page unmounts.
      saveVirtualScrollerState(virtualScrollerState.current);
    };
  });

  return (
    <Root {...props}>
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
    </Root>
  );
}
