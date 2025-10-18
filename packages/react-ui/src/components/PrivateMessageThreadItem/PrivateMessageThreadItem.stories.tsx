import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageThreadItem from './index';

export default {
  title: 'Design System/React UI/PrivateMessageThreadItem',
  component: PrivateMessageThreadItem
} as Meta<typeof PrivateMessageThreadItem>;

const template = (args) => (
  <div style={{width: 400}}>
    <PrivateMessageThreadItem {...args} />
  </div>
);

export const Base: StoryObj<PrivateMessageThreadItem> = {
  render: template
};
