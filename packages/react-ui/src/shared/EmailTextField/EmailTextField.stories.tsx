import type { Meta, StoryObj } from '@storybook/react';
import EmailTextField from './index';

export default {
  title: 'Design System/React UI Shared/Email Textfield',
  component: EmailTextField,
} as Meta<typeof EmailTextField>;

const template = (args) => <EmailTextField {...args} />;

export const Base: StoryObj<EmailTextField> = {
  render: template
};

export const BaseLabel: StoryObj<EmailTextField> = {
  args: {
    label: 'Label',
    name: 'email',
    id: 'email'
  },
  render: template
};