import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomAdvSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/CustomAdv',
  component: CustomAdvSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CustomAdvSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CustomAdvSkeleton> = (args) => (
  <div style={{width: 400}}>
    <CustomAdvSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
