import React from 'react';
import {ComponentStory, ComponentMeta, storiesOf} from '@storybook/react';
import WindowInf from './stories/WindowInfiniteScrollComponent';
import InfiniteScrollWithHeight from './stories/InfiniteScrollWithHeight';
import PullDownToRefreshInfScroll from './stories/PullDownToRefreshInfScroll';
import ScrollableTargetInfiniteScroll from './stories/ScrollableTargetInfScroll';
import ScrolleableTop from './stories/ScrolleableTop';

const stories = storiesOf('Design System/React UI Shared/InfiniteScroll', module);

stories.add('InfiniteScroll', () => <WindowInf />, {
  info: { inline: true },
});

stories.add('PullDownToRefresh', () => <PullDownToRefreshInfScroll />, {
  info: { inline: true },
});

stories.add('InfiniteScrollWithHeight', () => <InfiniteScrollWithHeight />, {
  info: { inline: true },
});

stories.add(
  'ScrollableTargetInfiniteScroll',
  () => <ScrollableTargetInfiniteScroll />,
  {
    info: { inline: true },
  }
);

stories.add('InfiniteScrollTop', () => <ScrolleableTop />, {
  info: { inline: true },
});

