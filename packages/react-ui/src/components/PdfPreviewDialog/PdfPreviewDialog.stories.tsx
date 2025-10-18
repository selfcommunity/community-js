import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PdfPreviewDialog from './index';

export default {
	title: 'Design System/React UI/PdfPreviewDialog',
	component: PdfPreviewDialog,
} as Meta<typeof PdfPreviewDialog>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<PdfPreviewDialog {...args} />
	</div>
);

export const Base: StoryObj<typeof PdfPreviewDialog> = {
	args: {},
	render: template
};


