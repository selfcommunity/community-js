import type { Meta, StoryObj } from '@storybook/react';
import CategoryHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/CategoryHeader',
  component: CategoryHeaderSkeleton
} as Meta<typeof CategoryHeaderSkeleton>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <CategoryHeaderSkeleton {...args} />
  </div>
);

export const Base: StoryObj<CategoryHeaderSkeleton> = {
  render: template
}