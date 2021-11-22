import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import CommentObject from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/CommentObject',
  component: CommentObject,
  argTypes: {
    id: {
      control: {type: 'number'},
      description: 'CommentObject Id',
      defaultValue: 7604,
      table: {defaultValue: {summary: 7604}}
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CommentObject>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CommentObject> = (args) => (
  <div style={{width: 500}}>
    <CommentObject {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
