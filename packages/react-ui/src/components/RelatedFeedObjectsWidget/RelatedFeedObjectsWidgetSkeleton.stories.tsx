import type { Meta, StoryObj } from '@storybook/react-webpack5';
import RelatedFeedObjectsWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/RelatedFeedObjectsWidget',
  component: RelatedFeedObjectsWidgetSkeleton
} as Meta<typeof RelatedFeedObjectsWidgetSkeleton>;

const template = () => (
  <div style={{width: 400}}>
    <RelatedFeedObjectsWidgetSkeleton />
  </div>
);

export const Base: StoryObj<typeof RelatedFeedObjectsWidgetSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
