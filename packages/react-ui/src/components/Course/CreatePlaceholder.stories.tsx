import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CourseCreatePlaceholder from './CreatePlaceholder';

export default {
	title: 'Design System/React UI/Course/Create Placeholder',
	component: CourseCreatePlaceholder,
	argTypes: {}
} as Meta<typeof CourseCreatePlaceholder>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<CourseCreatePlaceholder {...args} />
	</div>
);

export const Base: StoryObj<typeof CourseCreatePlaceholder> = {
	args: {
		// actionCreate: true,
	},
	render: template
};


