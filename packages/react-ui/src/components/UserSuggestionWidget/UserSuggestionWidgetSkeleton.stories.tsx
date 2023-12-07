import type { Meta, StoryObj } from '@storybook/react';
import UserSuggestionWidgetSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Suggestion Widget',
  component: UserSuggestionWidgetSkeleton
} as Meta<typeof UserSuggestionWidgetSkeleton>;

const template = (args) => (
  <div style={{width: 400}}>
    <UserSuggestionWidgetSkeleton {...args} />
  </div>
);

export const Base: StoryObj<typeof UserSuggestionWidgetSkeleton> = {
  args: {
    contained: true
  },
  render: template
};
