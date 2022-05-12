import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import MainFeedSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/Main Feed',
  component: MainFeedSkeletonTemplate
} as ComponentMeta<typeof MainFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MainFeedSkeletonTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <MainFeedSkeletonTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
