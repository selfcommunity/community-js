import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingFeedObject from './index';
import {FeedObjectTemplateType} from '../../types/feedObject';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Trending Feed Object',
  component: TrendingFeedObject,
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
    categoryId: 1,
    elevation: 1,
    variant: 'elevation',
    template: FeedObjectTemplateType.SNIPPET
  }
} as ComponentMeta<typeof TrendingFeedObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingFeedObject> = (args) => (
  <div style={{width: 500}}>
    <TrendingFeedObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
