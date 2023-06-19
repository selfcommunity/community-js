import PullDownToRefreshInfScroll from './PullDownToRefreshInfScroll';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PullDownToRefreshInfScroll> = {
  title: 'Design System/React UI Shared/InfiniteScroll/PullDownToRefresh',
};

export default meta;
type Story = StoryObj<typeof PullDownToRefreshInfScroll>;

export const InfiniteScroll: Story = {
  args: {
    info: { inline: true },
  },
  render: (args) => <PullDownToRefreshInfScroll />
};

