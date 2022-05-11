import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import FeedObjectDetailSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Skeleton/Feed Object Detail',
  component: FeedObjectDetailSkeletonTemplate
} as ComponentMeta<typeof FeedObjectDetailSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FeedObjectDetailSkeletonTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <FeedObjectDetailSkeletonTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
