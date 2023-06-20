import type { Meta, StoryObj } from '@storybook/react';
import CategoryFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Category Feed',
  component: CategoryFeedSkeletonTemplate
} as Meta<typeof CategoryFeedSkeletonTemplate>;

export const Base: StoryObj<typeof CategoryFeedSkeletonTemplate> = {
  render: (args) => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <CategoryFeedSkeletonTemplate {...args} />
    </div>
  )
};