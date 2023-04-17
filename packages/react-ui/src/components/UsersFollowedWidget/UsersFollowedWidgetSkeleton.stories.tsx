import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UsersFollowedWidgetSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/UsersFollowedWidget',
  component: UsersFollowedWidgetSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UsersFollowedWidgetSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UsersFollowedWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UsersFollowedWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
