import type { Meta, StoryObj } from '@storybook/react';
import LanguageSwitcher from './index';

export default {
  title: 'Design System/React UI Shared/LanguageSwitcher',
  component: LanguageSwitcher
} as Meta<typeof LanguageSwitcher>;

const template = (args) => <LanguageSwitcher {...args} />;

export const Base: StoryObj<typeof LanguageSwitcher> = {
  render: template
};
