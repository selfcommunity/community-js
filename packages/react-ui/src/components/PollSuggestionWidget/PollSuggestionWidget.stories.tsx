import type { Meta, StoryObj } from '@storybook/react';
import PollSuggestionWidget from './index';

export default {
  title: 'Design System/React UI/Poll Suggestion Widget',
  component: PollSuggestionWidget
} as Meta<typeof PollSuggestionWidget>;

const template = (args) => (
  <div style={{maxWidth: 500}}>
    <PollSuggestionWidget {...args} />
  </div>
);

export const Base: StoryObj<PollSuggestionWidget> = {
  args: {
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
