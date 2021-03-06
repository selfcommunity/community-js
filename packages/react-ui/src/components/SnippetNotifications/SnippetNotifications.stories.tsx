import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import SnippetNotifications from './index';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Design System/React UI/SnippetNotifications',
  component: SnippetNotifications
} as ComponentMeta<typeof SnippetNotifications>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SnippetNotifications> = (args) => (
  <div style={{width: 280}}>
    <SnippetNotifications {...args} />
  </div>
);

export const Base = Template.bind({});

Base.args = {
  onNotificationClick: (e, n) => {
    /**
     * Example of onNotificationClick callback
     * e.preventDefault();
     * e.stopPropagation();
     * console.log(n);
     */
  }
};

export const FewNotifications = Template.bind({});

FewNotifications.args = {
  showMax: 3
};
