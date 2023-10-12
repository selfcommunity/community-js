import type { Meta, StoryObj } from '@storybook/react';
import ComposerSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI Unstable/Skeleton/Composer',
  component: ComposerSkeleton
} as Meta<typeof ComposerSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <ComposerSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof ComposerSkeleton> = {
  render: template
};
