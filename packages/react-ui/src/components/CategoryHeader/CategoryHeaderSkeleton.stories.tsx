import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategoryHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/CategoryHeader',
  component: CategoryHeaderSkeleton
} as Meta<typeof CategoryHeaderSkeleton>;

const template = () => (
  <div style={{width: '100%'}}>
    <CategoryHeaderSkeleton />
  </div>
);

export const Base: StoryObj<typeof CategoryHeaderSkeleton> = {
  render: template
}