import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserConnectionsSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/User Connections Widget',
  component: UserConnectionsSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserConnectionsSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserConnectionsSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
