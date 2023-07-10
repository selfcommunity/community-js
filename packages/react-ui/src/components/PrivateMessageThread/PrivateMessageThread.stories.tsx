import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageThread from './index';

export default {
  title: 'Design System/React UI/PrivateMessageThread',
  component: PrivateMessageThread
} as Meta<typeof PrivateMessageThread>;

const template = (args) => (
  <div style={{maxWidth: 600}}>
    <PrivateMessageThread {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageThread> = {
  args: {
    userObj: 7
  },
  render: template
};

