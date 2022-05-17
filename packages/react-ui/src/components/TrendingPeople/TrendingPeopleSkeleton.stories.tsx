import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingPeopleSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/TrendingPeople',
  component: TrendingPeopleSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TrendingPeopleSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingPeopleSkeleton> = (args) => (
  <div style={{width: 400}}>
    <TrendingPeopleSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
