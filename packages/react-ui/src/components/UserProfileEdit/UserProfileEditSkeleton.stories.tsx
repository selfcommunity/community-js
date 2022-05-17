import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserProfileEditSkeleton from './Skeleton';

export default {
  title: 'Design System/React UI/Skeleton/User Profile Edit',
  component: UserProfileEditSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof UserProfileEditSkeleton>;

const Template: ComponentStory<typeof UserProfileEditSkeleton> = (args) => (
  <div style={{width: '100%'}}>
    <UserProfileEditSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
