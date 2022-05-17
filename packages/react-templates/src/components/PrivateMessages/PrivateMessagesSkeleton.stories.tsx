import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrivateMessagesSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/PrivateMessages',
  component: PrivateMessagesSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessagesSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessagesSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessagesSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
