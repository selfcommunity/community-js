import type { Meta, StoryObj } from '@storybook/react';
import CentralProgress from './index';

export default {
  title: 'Design System/React UI Shared/CentralProgress',
  component: CentralProgress,
  argTypes: {
    size: {
      control: {type: 'number'},
      description: 'Size of the circular progress.',
      table: {defaultValue: {summary: 30}}
    }
  },
  args: {
    size: 30
  }
} as Meta<typeof CentralProgress>;

const template = (args) => <CentralProgress {...args} />;

export const Base: StoryObj<CentralProgress> = {
  args: {
    size: 30
  },
  render: template
};
