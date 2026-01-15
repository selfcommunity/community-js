import type { Meta, StoryObj } from '@storybook/react-webpack5';
import WindowInf from './WindowInfiniteScrollComponent';

const meta: Meta<typeof WindowInf> = {
  title: 'Design System/React UI Shared/InfiniteScroll/InfiniteScrollBase',
};

export default meta;

type Story = StoryObj<typeof WindowInf>;
export const Base: Story = {
  args: {
    info: { inline: true },
  },
  render: () => <WindowInf />
};

