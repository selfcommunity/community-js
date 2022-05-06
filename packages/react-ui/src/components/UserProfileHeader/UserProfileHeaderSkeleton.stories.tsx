import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserProfileHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/SC UI/Skeleton/User Profile Header',
  component: UserProfileHeaderSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof UserProfileHeaderSkeleton>;

const Template: ComponentStory<typeof UserProfileHeaderSkeleton> = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileHeaderSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
