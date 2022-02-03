import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingFeedSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC UI/Skeleton/TrendingFeed',
  component: TrendingFeedSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TrendingFeedSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingFeedSkeleton> = (args) => (
  <div style={{width: 400}}>
    <TrendingFeedSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
