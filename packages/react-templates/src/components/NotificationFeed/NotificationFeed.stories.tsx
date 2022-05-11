import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import NotificationFeedTemplate from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React TEMPLATES/Notification Feed',
  component: NotificationFeedTemplate
} as ComponentMeta<typeof NotificationFeedTemplate>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NotificationFeedTemplate> = (args) => (
  <div style={{maxWidth: '1200px', width: '100%', height: '500px'}}>
    <NotificationFeedTemplate {...args} />
  </div>
);

export const Notification = Template.bind({});

Notification.args = {};
