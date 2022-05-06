import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UsersFollowedSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/UsersFollowed',
  component: UsersFollowedSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UsersFollowedSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UsersFollowedSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UsersFollowedSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
