import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LanguageSwitcher, { LanguageSwitcherProps } from './index';

export default {
  title: 'Design System/React UI Shared/LanguageSwitcher',
  component: LanguageSwitcher
} as Meta<typeof LanguageSwitcher>;

const template = (args:LanguageSwitcherProps) => <LanguageSwitcher {...args} />;

export const Base: StoryObj<typeof LanguageSwitcher> = {
  render: template
};
