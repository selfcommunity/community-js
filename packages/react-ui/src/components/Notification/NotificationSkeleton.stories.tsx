import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import NotificationSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/Notification',
  component: NotificationSkeleton,
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
} as ComponentMeta<typeof NotificationSkeleton>;

const Template: ComponentStory<typeof NotificationSkeleton> = (args) => (
  <div style={{width: 400}}>
    <NotificationSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
