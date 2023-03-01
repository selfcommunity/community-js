import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrivateMessageComponentSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageComponent',
  component: PrivateMessageComponentSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageComponentSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageComponentSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageComponentSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
