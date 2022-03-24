import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingFeed from './index';
import {SCFeedObjectTemplateType} from '../../types/feedObject';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Trending Feed',
  component: TrendingFeed,
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
    template: SCFeedObjectTemplateType.SNIPPET
  }
} as ComponentMeta<typeof TrendingFeed>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingFeed> = (args) => (
  <div style={{width: 500}}>
    <TrendingFeed {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
