import type { Meta, StoryObj } from '@storybook/react-webpack5';
import MainFeedSkeletonTemplate from './Skeleton';

export default {
  title: 'Design System/React TEMPLATES/Skeleton/Main Feed',
  component: MainFeedSkeletonTemplate
} as Meta<typeof MainFeedSkeletonTemplate>;

export const Base: StoryObj<typeof MainFeedSkeletonTemplate> = {
  render: () => (
    <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
      <MainFeedSkeletonTemplate />
    </div>
  )
};
