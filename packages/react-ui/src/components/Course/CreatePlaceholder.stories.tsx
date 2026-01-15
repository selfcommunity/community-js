import type { Meta, StoryObj } from '@storybook/react-webpack5';
import CourseCreatePlaceholder from './CreatePlaceholder';
import { CourseSkeletonProps } from './Skeleton';

export default {
	title: 'Design System/React UI/Course/Create Placeholder',
	component: CourseCreatePlaceholder,
	argTypes: {}
} as Meta<typeof CourseCreatePlaceholder>;

const template = (args: CourseSkeletonProps) => (
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


