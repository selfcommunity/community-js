import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import IncubatorSuggestionSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/IncubatorSuggestion',
  component: IncubatorSuggestionSkeleton,
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
} as ComponentMeta<typeof IncubatorSuggestionSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof IncubatorSuggestionSkeleton> = (args) => (
  <div style={{width: 500}}>
    <IncubatorSuggestionSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
