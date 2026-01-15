import type { Meta, StoryObj } from '@storybook/react-webpack5';
import SnippetNotifications, { SnippetNotificationsProps } from './index';

export default {
  title: 'Design System/React UI/SnippetNotifications',
  component: SnippetNotifications
} as Meta<typeof SnippetNotifications>;

const template = (args: SnippetNotificationsProps) => (
  <div style={{width: 280}}>
    <SnippetNotifications {...args} />
  </div>
);

export const Base: StoryObj<typeof SnippetNotifications> = {
  args: {
    onNotificationClick: (_e, _n) => {
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

export const FewNotifications: StoryObj<typeof SnippetNotifications> = {
  args: {
    showMax: 3
  },
  render: template
};
