import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import NotificationFeedSkeletonTemplate from './Skeleton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/SC TEMPLATES/Skeleton/Notification Feed',
  component: NotificationFeedSkeletonTemplate
} as ComponentMeta<typeof NotificationFeedSkeletonTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NotificationFeedSkeletonTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <NotificationFeedSkeletonTemplate {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {};
