import type { Meta, StoryObj } from '@storybook/react-webpack5';
import PdfPreview, { PdfPreviewProps } from './index';

export default {
	title: 'Design System/React UI/PdfPreview',
	component: PdfPreview,
} as Meta<typeof PdfPreview>;

const template = (args: PdfPreviewProps) => (
	<div style={{ maxWidth: 400 }}>
		<PdfPreview {...args} />
	</div>
);

export const Base: StoryObj<typeof PdfPreview> = {
	args: {},
	render: template
};


