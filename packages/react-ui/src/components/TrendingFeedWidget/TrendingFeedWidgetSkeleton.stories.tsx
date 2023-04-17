import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingFeedWidgetSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/TrendingFeedWidget',
  component: TrendingFeedWidgetSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TrendingFeedWidgetSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingFeedWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <TrendingFeedWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
