import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {InterestBoxSkeleton} from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/InterestBox',
  component: InterestBoxSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof InterestBoxSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InterestBoxSkeleton> = (args) => (
  <div style={{width: 400}}>
    <InterestBoxSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
