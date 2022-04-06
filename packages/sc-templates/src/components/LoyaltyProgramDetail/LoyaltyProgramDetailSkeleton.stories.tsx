import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import LoyaltyProgramDetailSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Skeleton/Loyalty Program Detail',
  component: LoyaltyProgramDetailSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof LoyaltyProgramDetailSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoyaltyProgramDetailSkeleton> = (args) => (
  <div style={{width: 400}}>
    <LoyaltyProgramDetailSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
