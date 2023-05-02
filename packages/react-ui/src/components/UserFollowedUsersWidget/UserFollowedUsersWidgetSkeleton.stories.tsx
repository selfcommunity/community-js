import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserFollowedUsersWidgetSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/User Followed Users Widget',
  component: UserFollowedUsersWidgetSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserFollowedUsersWidgetSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserFollowedUsersWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UserFollowedUsersWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
