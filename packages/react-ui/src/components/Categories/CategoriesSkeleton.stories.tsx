import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CategoriesSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/Skeleton/Categories',
  component: CategoriesSkeleton,
} as ComponentMeta<typeof CategoriesSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoriesSkeleton> = (args) => (
  <div>
    <CategoriesSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
