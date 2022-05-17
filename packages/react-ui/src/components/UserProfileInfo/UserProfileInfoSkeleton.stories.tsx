import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserProfileInfoSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile Info',
  component: UserProfileInfoSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof UserProfileInfoSkeleton>;

const Template: ComponentStory<typeof UserProfileInfoSkeleton> = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileInfoSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
