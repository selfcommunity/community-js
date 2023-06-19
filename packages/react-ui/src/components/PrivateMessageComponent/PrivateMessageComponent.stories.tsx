import type { Meta, StoryObj } from '@storybook/react';
import PrivateMessageComponent from './index';

export default {
  title: 'Design System/React UI/PrivateMessageComponent',
  component: PrivateMessageComponent
} as Meta<typeof PrivateMessageComponent>;

const template = (args) =>
  <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
    <PrivateMessageComponent {...args} />
  </div>

export const Base: StoryObj<PrivateMessageComponent> = {
  render: template
};