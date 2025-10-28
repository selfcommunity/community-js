import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageEditorSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageEditor',
  component: PrivateMessageEditorSkeleton
} as Meta<typeof PrivateMessageEditorSkeleton>;

const template = () => (
  <div style={{width: 400}}>
    <PrivateMessageEditorSkeleton />
  </div>
);

export const Base: StoryObj<typeof PrivateMessageEditorSkeleton> = {
  args: {
    contained: true
  },
  render: template
};