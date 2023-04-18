import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import CommentObjectReply from './index';
import { SCContributionType } from '@selfcommunity/types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Comment Object Reply',
  component: CommentObjectReply,
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
    variant: 'outlined'
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CommentObjectReply>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentObjectReply> = (args) => (
  <div style={{width: 500}}>
    <CommentObjectReply {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
