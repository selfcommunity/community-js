import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import ExploreFeedSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Skeleton/Explore Feed',
  component: ExploreFeedSkeletonTemplate
} as ComponentMeta<typeof ExploreFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ExploreFeedSkeletonTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <ExploreFeedSkeletonTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
