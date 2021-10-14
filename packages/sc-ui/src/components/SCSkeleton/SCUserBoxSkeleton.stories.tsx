import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {SCUserBoxSkeleton} from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/UserBox',
  component: SCUserBoxSkeleton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SCUserBoxSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SCUserBoxSkeleton> = (args) => <div style={{width: 400}}><SCUserBoxSkeleton {...args} /></div>;

export const Base = Template.bind({});

Base.args = {
  contained: true
};
