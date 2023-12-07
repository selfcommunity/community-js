import type { Meta, StoryObj } from '@storybook/react';
import RelatedFeedObjectsWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/RelatedFeedObjectsWidget',
  component: RelatedFeedObjectsWidgetSkeleton
} as Meta<typeof RelatedFeedObjectsWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <RelatedFeedObjectsWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<RelatedFeedObjectsWidgetSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
