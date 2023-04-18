import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PollSuggestionWidget from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Poll Suggestion Widget',
  component: PollSuggestionWidget,
  argTypes: {
    elevation: {
      control: {type: 'number'},
      description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
      table: {defaultValue: {summary: 1}}
    },
    variant: {
      options: ['elevation', 'outlined'],
      control: {type: 'select'},
      description: 'The variant to use. Types: "elevation", "outlined", etc.',
      table: {defaultValue: {summary: 'elevation'}}
    }
  },
  args: {
    elevation: 1,
    variant: 'elevation'
  }
} as ComponentMeta<typeof PollSuggestionWidget>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PollSuggestionWidget> = (args) => (
  <div style={{maxWidth: 500}}>
    <PollSuggestionWidget {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
