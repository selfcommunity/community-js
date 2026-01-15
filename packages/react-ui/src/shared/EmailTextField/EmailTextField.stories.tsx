import type { Meta, StoryObj } from '@storybook/react-webpack5';
import EmailTextField from './index';
import { TextFieldProps } from '@mui/material';

export default {
  title: 'Design System/React UI Shared/EmailTextfield',
  component: EmailTextField,
} as Meta<typeof EmailTextField>;

const template = (args: TextFieldProps) => <EmailTextField {...args} />;

export const Base: StoryObj<typeof EmailTextField> = {
  render: template
};

export const BaseLabel: StoryObj<typeof EmailTextField> = {
  args: {
    label: 'Label',
    name: 'email',
    id: 'email'
  },
  render: template
};
