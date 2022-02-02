import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import CategoryFeedSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Skeleton/Category Feed',
  component: CategoryFeedSkeletonTemplate
} as ComponentMeta<typeof CategoryFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CategoryFeedSkeletonTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <CategoryFeedSkeletonTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
