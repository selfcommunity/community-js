import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageEditorSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageEditor',
  component: PrivateMessageEditorSkeleton
} as Meta<typeof PrivateMessageEditorSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageEditorSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageEditorSkeleton> = {
  args: {
    contained: true
  },
  render: template
};