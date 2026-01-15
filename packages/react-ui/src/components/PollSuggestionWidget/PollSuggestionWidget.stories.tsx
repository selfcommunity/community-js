import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PollSuggestionWidget, { PollSuggestionWidgetProps } from './index';

export default {
  title: 'Design System/React UI/Poll Suggestion Widget',
  component: PollSuggestionWidget
} as Meta<typeof PollSuggestionWidget>;

const template = (args: PollSuggestionWidgetProps) => (
  <div style={{maxWidth: 500}}>
    <PollSuggestionWidget {...args} />
  </div>
);

export const Base: StoryObj<typeof PollSuggestionWidget> = {
  args: {
    elevation: 1,
    variant: 'elevation'
  },
  render: template
};
