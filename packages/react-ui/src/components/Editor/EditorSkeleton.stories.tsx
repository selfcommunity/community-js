import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EditorSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Editor',
  component: EditorSkeleton
} as Meta<typeof EditorSkeleton>;

const template = () => (
  <div style={{width: 400}}>
    <EditorSkeleton />
  </div>
);

export const Base: StoryObj<typeof EditorSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
