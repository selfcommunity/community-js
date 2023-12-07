import ScrolleableTop from './ScrolleableTop';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ScrolleableTop> = {
  title: 'Design System/React UI Shared/InfiniteScroll/ScrolleableTop',
};

export default meta;
type Story = StoryObj<typeof ScrolleableTop>;

export const InfiniteScroll: Story = {
  args: {
    info: { inline: true },
  },
  render: (args) => <ScrolleableTop />
};

