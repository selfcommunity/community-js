import type { Meta, StoryObj } from '@storybook/react';
import SnippetNotifications from './index';

export default {
  title: 'Design System/React UI/SnippetNotifications',
  component: SnippetNotifications
} as Meta<typeof SnippetNotifications>;

const template = (args) => (
  <div style={{width: 280}}>
    <SnippetNotifications {...args} />
  </div>
);

export const Base: StoryObj<SnippetNotifications> = {
  args: {
    onNotificationClick: (e, n) => {
      /**
       * Example of onNotificationClick callback
       * e.preventDefault();
       * e.stopPropagation();
       * console.log(n);
       */
    },
    onFetchNotifications: (data) => {
      console.log(data);
    }
  },
  render: template
};

export const FewNotifications: StoryObj<SnippetNotifications> = {
  args: {
    showMax: 3
  },
  render: template
};
