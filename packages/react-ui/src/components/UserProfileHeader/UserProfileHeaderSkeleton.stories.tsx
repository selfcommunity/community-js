import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserProfileHeaderSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile AppBar',
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
