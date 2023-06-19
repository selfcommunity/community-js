import InfiniteScrollWithHeight from './InfiniteScrollWithHeight';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InfiniteScrollWithHeight> = {
  title: 'Design System/React UI Shared/InfiniteScroll/InfiniteScrollWithHeight',
};

export default meta;
type Story = StoryObj<typeof InfiniteScrollWithHeight>;

export const InfiniteScroll: Story = {
  args: {
    info: { inline: true },
  },
  render: (args) => <InfiniteScrollWithHeight />
};

