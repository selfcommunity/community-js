import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import PrizeItemSkeleton from './PrizeItemSkeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Loyalty Program Detail/Prize Item',
  component: PrizeItemSkeleton
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PrizeItemSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PrizeItemSkeleton> = (args) => (
  <div style={{width: '300px'}}>
    <PrizeItemSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
