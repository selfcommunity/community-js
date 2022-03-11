import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import RelatedDiscussion from './index';
import {SCFeedObjectTypologyType} from '@selfcommunity/core';
import {FeedObjectTemplateType} from '../../types/feedObject';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Related Discussion',
  component: RelatedDiscussion,
  argTypes: {
    feedObjectId: {
      control: {type: 'number'},
      description: 'FeedObject Id',
      table: {defaultValue: {summary: 67522}}
    },
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
    feedObjectId: 23,
    feedObjectType: SCFeedObjectTypologyType.DISCUSSION,
    template: FeedObjectTemplateType.SNIPPET,
    elevation: 1,
    variant: 'elevation'
  }
} as ComponentMeta<typeof RelatedDiscussion>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof RelatedDiscussion> = (args) => (
  <div style={{maxWidth: 500}}>
    <RelatedDiscussion {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
