import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CategoryFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Category Feed',
  component: CategoryFeedSkeletonTemplate
} as Meta<typeof CategoryFeedSkeletonTemplate>;

export const Base: StoryObj<typeof CategoryFeedSkeletonTemplate> = {
  render: () => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <CategoryFeedSkeletonTemplate />
    </div>
  )
};