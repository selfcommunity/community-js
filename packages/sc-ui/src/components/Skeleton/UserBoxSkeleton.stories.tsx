import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {UserBoxSkeleton} from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/UserBox',
  component: UserBoxSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof UserBoxSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserBoxSkeleton> = (args) => (
  <div style={{width: 400}}>
    <UserBoxSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
