import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TrendingPeopleWidgetSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/TrendingPeopleWidget',
  component: TrendingPeopleWidgetSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TrendingPeopleWidgetSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TrendingPeopleWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <TrendingPeopleWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
