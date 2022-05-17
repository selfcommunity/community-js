import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ToastNotificationsSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/ToastNotifications',
  component: ToastNotificationsSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ToastNotificationsSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ToastNotificationsSkeleton> = (args) => (
  <div style={{width: 400}}>
    <ToastNotificationsSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
