import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CategoryTrendingFeedWidgetSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/CategoryTrendingFeedWidget',
  component: CategoryTrendingFeedWidgetSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CategoryTrendingFeedWidgetSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoryTrendingFeedWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <CategoryTrendingFeedWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
