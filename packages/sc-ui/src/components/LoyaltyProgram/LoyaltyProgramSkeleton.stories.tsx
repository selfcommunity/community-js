import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import LoyaltyProgramSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/LoyaltyProgram',
  component: LoyaltyProgramSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoyaltyProgramSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoyaltyProgramSkeleton> = (args) => (
  <div style={{width: 400}}>
    <LoyaltyProgramSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
