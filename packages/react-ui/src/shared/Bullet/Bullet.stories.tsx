import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Bullet from './index';

export default {
  title: 'Design System/React UI Shared/Bullet',
  component: Bullet
} as Meta<typeof Bullet>;

const template = (args: any) => <Bullet {...args} />;

export const Base: StoryObj<typeof Bullet> = {
  render: template
};
