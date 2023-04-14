import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PlatformWidgetSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/PlatformWidget',
  component: PlatformWidgetSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PlatformWidgetSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PlatformWidgetSkeleton> = (args) => (
  <div style={{width: 400}}>
    <PlatformWidgetSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  contained: true
};
