import WindowInf from './WindowInfiniteScrollComponent';
/* import InfiniteScrollWithHeight from './stories/InfiniteScrollWithHeight';
import PullDownToRefreshInfScroll from './stories/PullDownToRefreshInfScroll';
import ScrollableTargetInfiniteScroll from './stories/ScrollableTargetInfScroll';
import ScrolleableTop from './stories/ScrolleableTop'; */
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof WindowInf> = {
  title: 'Design System/React UI Shared/InfiniteScroll/InfiniteScrollBase',
};

export default meta;
type Story = StoryObj<typeof WindowInf>;

export const Base: Story = {
  args: {
    info: { inline: true },
  },
  render: (args) => <WindowInf />
};

