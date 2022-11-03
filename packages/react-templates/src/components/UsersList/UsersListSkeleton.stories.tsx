import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UsersListSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/User Profile',
  component: UsersListSkeleton
} as ComponentMeta<typeof UsersListSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UsersListSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UsersListSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
