import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import UserConnectionsRequestsSentSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/User Connections Requests Sent Widget',
  component: UserConnectionsRequestsSentSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserConnectionsRequestsSentSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserConnectionsRequestsSentSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UserConnectionsRequestsSentSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
