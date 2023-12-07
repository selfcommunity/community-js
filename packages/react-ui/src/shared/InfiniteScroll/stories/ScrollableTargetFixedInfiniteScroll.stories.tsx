import ScrollableTargetFixedInfScroll from './ScrollableTargetFixedInfScroll';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ScrollableTargetFixedInfScroll> = {
  title: 'Design System/React UI Shared/InfiniteScroll/ScrollableTargetFixedInfScroll',
};

export default meta;
type Story = StoryObj<typeof ScrollableTargetFixedInfScroll>;

export const Base: Story = {
  args: {
    info: { inline: true },
  },
  render: (args) => <ScrollableTargetFixedInfScroll />
};

