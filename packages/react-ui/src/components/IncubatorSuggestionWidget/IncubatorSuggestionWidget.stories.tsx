import type { Meta, StoryObj } from '@storybook/react';
import IncubatorSuggestionWidget from './index';

export default {
  title: 'Design System/React UI/Incubator Suggestion Widget',
  component: IncubatorSuggestionWidget,
} as Meta<typeof IncubatorSuggestionWidget>;

const template = (args) => (
  <div style={{width: 500}}>
    <IncubatorSuggestionWidget {...args} />
  </div>
);

export const Base: StoryObj<IncubatorSuggestionWidget> = {
  args: {
    userId: 157
  },
  render: template
};