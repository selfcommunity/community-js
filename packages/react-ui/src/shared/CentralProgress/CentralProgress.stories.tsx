import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CentralProgress from './index';
import { CircularProgressProps } from '@mui/material';

export default {
  title: 'Design System/React UI Shared/CentralProgress',
  component: CentralProgress,
  argTypes: {
    size: {
      control: {type: 'number'},
      description: 'Size of the circular progress.',
      table: {defaultValue: {summary: '30'}}
    }
  },
  args: {
    size: 30
  }
} as Meta<typeof CentralProgress>;

const template = (args: CircularProgressProps) => <CentralProgress {...args} />;

export const Base: StoryObj<typeof CentralProgress> = {
  args: {
    size: 30
  },
  render: template
};
