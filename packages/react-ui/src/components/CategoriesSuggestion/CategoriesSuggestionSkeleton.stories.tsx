import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CategoriesSuggestionSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/CategoriesSuggestion',
  component: CategoriesSuggestionSkeleton,
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
} as ComponentMeta<typeof CategoriesSuggestionSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoriesSuggestionSkeleton> = (args) => (
  <div style={{width: 400}}>
    <CategoriesSuggestionSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
