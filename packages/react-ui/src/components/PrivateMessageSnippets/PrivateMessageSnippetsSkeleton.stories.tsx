import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageSnippetsSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageSnippets',
  component: PrivateMessageSnippetsSkeleton
} as Meta<typeof PrivateMessageSnippetsSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageSnippetsSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageSnippetsSkeleton> = {
  args: {
    contained: true
  },
  render: template
};