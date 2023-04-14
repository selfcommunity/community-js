import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import LoyaltyProgramWidgetSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/LoyaltyProgramWidget',
  component: LoyaltyProgramWidgetSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoyaltyProgramWidgetSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoyaltyProgramWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <LoyaltyProgramWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
