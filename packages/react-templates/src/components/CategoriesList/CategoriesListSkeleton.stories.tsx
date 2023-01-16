import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import CategoriesListSkeleton from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Categories List',
  component: CategoriesListSkeleton
} as ComponentMeta<typeof CategoriesListSkeleton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoriesListSkeleton> = (args) => (
  <div style={{width: '100%'}}>
    <CategoriesListSkeleton {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
