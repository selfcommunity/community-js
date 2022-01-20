import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {CategoryBoxSkeleton} from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/CategoryBox',
  component: CategoryBoxSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CategoryBoxSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoryBoxSkeleton> = (args) => (
  <div style={{width: 400}}>
    <CategoryBoxSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
