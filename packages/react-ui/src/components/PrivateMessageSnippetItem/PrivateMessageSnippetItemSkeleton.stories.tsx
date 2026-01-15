import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageSnippetItemSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageSnippetItem',
  component: PrivateMessageSnippetItemSkeleton
} as Meta<typeof PrivateMessageSnippetItemSkeleton>;

const template = (args: any) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetItemSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof PrivateMessageSnippetItemSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
