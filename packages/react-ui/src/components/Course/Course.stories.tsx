import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Course, { CourseProps } from './index';
import { SCCourseTemplateType } from '../../types';

export default {
	title: 'Design System/React UI/Course',
	component: Course,
	argTypes: {
		courseId: {
			control: { type: 'number' },
			description: 'Course Id',
			table: { defaultValue: { summary: '1' } }
		},
		elevation: {
			control: { type: 'number' },
			description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
			table: { defaultValue: { summary: '1' } }
		},
		variant: {
			options: ['elevation', 'outlined'],
			control: { type: 'select' },
			description: 'The variant to use. Types: "elevation", "outlined", etc.',
			table: { defaultValue: { summary: 'elevation' } }
		}
	}
} as Meta<typeof Course>;

const template = (args: CourseProps) => (
	<div style={{ maxWidth: 400 }}>
		<Course {...args} />
	</div>
);

export const Base: StoryObj<typeof Course> = {
	args: {
		courseId: 6
	},
	render: template
};

export const Snippet: StoryObj<typeof Course> = {
	args: {
		template: SCCourseTemplateType.SNIPPET,
		courseId: 6,
		elevation: 0,
		variant: 'elevation',
		square: false
	},
	render: template
};

export const SnippetOutlined: StoryObj<typeof Course> = {
	args: {
		template: SCCourseTemplateType.SNIPPET,
		courseId: 6,
		elevation: 0,
		variant: 'outlined',
		square: false
	},
	render: template
};


