import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import UserFeedSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Skeleton/User Feed',
  component: UserFeedSkeletonTemplate
} as ComponentMeta<typeof UserFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserFeedSkeletonTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <UserFeedSkeletonTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
