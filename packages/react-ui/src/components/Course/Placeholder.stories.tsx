import type { Meta, StoryObj } from '@storybook/react';
import CoursePlaceholder from './Placeholder';

export default {
	title: 'Design System/React UI/Course/Placeholder',
	component: CoursePlaceholder,
	argTypes: {}
} as Meta<typeof CoursePlaceholder>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<CoursePlaceholder {...args} />
	</div>
);

export const Base: StoryObj<typeof CoursePlaceholder> = {
	args: {
		// actionCreate: true,
	},
	render: template
};


