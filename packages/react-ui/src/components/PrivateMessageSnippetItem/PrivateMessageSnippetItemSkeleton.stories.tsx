import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageSnippetItemSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageSnippetItem',
  component: PrivateMessageSnippetItemSkeleton
} as Meta<typeof PrivateMessageSnippetItemSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetItemSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageSnippetItemSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
