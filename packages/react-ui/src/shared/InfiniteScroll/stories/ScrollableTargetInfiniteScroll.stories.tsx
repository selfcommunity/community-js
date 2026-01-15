import ScrollableTargetInfScroll from './ScrollableTargetInfScroll';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof ScrollableTargetInfScroll> = {
  title: 'Design System/React UI Shared/InfiniteScroll/ScrollableTargetInfScroll',
};

export default meta;
type Story = StoryObj<typeof ScrollableTargetInfScroll>;

export const Base: Story = {
  args: {
    info: { inline: true },
  },
  render: (args) => <ScrollableTargetInfScroll />
};

