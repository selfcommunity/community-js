import type { Meta, StoryObj } from '@storybook/react';
import Bullet from './index';

export default {
  title: 'Design System/React UI Shared/Bullet',
  component: Bullet
} as Meta<typeof Bullet>;

const template = (args) => <Bullet {...args} />;

export const Base: StoryObj<Bullet> = {
  render: template
};
