import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserConnectionsRequestsSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/User Connections Widget',
  component: UserConnectionsRequestsSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserConnectionsRequestsSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserConnectionsRequestsSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
