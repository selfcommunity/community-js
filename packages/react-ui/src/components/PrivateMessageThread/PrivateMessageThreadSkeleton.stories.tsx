import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrivateMessageThreadSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageThread',
  component: PrivateMessageThreadSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageThreadSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageThreadSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageThreadSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
