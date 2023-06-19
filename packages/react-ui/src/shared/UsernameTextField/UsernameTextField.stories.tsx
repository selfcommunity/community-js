import type { Meta, StoryObj } from '@storybook/react';
import UsernameTextField from './index';

export default {
  title: 'Design System/React UI Shared/Username Textfield',
  component: UsernameTextField,
} as Meta<typeof UsernameTextField>;

const template = (args) => <UsernameTextField {...args} />;

export const Base: StoryObj<typeof UsernameTextField> = {
  render: template
};

export const BaseLabel: StoryObj<typeof UsernameTextField> = {
  args: {
    label: 'Label',
    name: 'username',
    id: 'username'
  },
  render: template
};

export const BaseLabelValue: StoryObj<typeof UsernameTextField> = {
  args: {
    label: 'Label',
    name: 'username',
    id: 'username',
    value: 'value'
  },
  render: template
};