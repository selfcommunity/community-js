import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CopyTextField, { CopyTextFieldProps } from './index';

export default {
  title: 'Design System/React UI Shared/CopyTextField',
  component: CopyTextField
} as Meta<typeof CopyTextField>;

const template = (args: CopyTextFieldProps) => <CopyTextField {...args} />;

export const Base: StoryObj<typeof CopyTextField> = {
	args: {
		label: 'Copia il link'
	},
  render: template
};
