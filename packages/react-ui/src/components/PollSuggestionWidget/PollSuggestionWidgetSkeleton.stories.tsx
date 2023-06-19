import type { Meta, StoryObj } from '@storybook/react';
import PollSuggestionWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/PollSuggestionWidget',
  component: PollSuggestionWidgetSkeleton
} as Meta<typeof PollSuggestionWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <PollSuggestionWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<PollSuggestionWidgetSkeleton> = {
  args: {
    contained: true,
  },
  render: template
};
