import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrivateMessageActionMenuSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/PrivateMessageActionMenu',
  component: PrivateMessageActionMenuSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrivateMessageActionMenuSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrivateMessageActionMenuSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageActionMenuSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
