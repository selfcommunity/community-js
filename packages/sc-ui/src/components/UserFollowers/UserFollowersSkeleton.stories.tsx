import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserFollowersSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/UserFollowers',
  component: UserFollowersSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserFollowersSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserFollowersSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UserFollowersSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
