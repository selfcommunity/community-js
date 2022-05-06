import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import BroadcastMessagesSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/Broadcast Messages',
  component: BroadcastMessagesSkeleton,
  argTypes: {},
  args: {}
} as ComponentMeta<typeof BroadcastMessagesSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BroadcastMessagesSkeleton> = (args) => (
  <div style={{width: 400}}>
    <BroadcastMessagesSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
