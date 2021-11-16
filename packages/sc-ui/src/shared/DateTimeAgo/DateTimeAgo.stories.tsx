import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import DateTimeAgo from './index';

export default {
  title: 'Design System/SHARED COMPONENT/DateTimeAgo',
  component: DateTimeAgo,
  argTypes: {
    date: {
      control: {type: 'date'},
      description: 'Date',
      table: {defaultValue: {summary: new Date()}}
    },
    live: {
      control: {type: 'boolean'},
      description: 'Live update',
      table: {defaultValue: {summary: true}}
    }
  }
} as ComponentMeta<typeof DateTimeAgo>;

const Template: ComponentStory<typeof DateTimeAgo> = (args) => <DateTimeAgo {...args} />;

export const Base = Template.bind({});

Base.args = {
  date: new Date(),
  live: true
};
