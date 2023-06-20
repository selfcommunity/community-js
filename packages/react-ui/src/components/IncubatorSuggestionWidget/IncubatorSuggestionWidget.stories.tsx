import type { Meta, StoryObj } from '@storybook/react';
import IncubatorSuggestionWidget from './index';

export default {
  title: 'Design System/React UI/Incubator Suggestion Widget',
  component: IncubatorSuggestionWidget,
  argTypes: {
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    },
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
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