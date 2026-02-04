import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PrivateMessageComponent, { PrivateMessageComponentProps } from './index';

export default {
  title: 'Design System/React UI/PrivateMessageComponent',
  component: PrivateMessageComponent
} as Meta<typeof PrivateMessageComponent>;

const template = (args: PrivateMessageComponentProps) =>
  <div style={{width: '100%', height: '100%', position: 'absolute', top: 70, left: 0}}>
    <PrivateMessageComponent {...args} />
  </div>

export const Base: StoryObj<typeof PrivateMessageComponent> = {
  render: template
};
