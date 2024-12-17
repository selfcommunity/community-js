import type { Meta, StoryObj } from '@storybook/react';
import { SCCourseTemplateType } from '../../types/course';
import Course from './index';

export default {
	title: 'Design System/React UI/Course',
	component: Course,
	argTypes: {
		courseId: {
			control: { type: 'number' },
			description: 'Course Id',
			table: { defaultValue: { summary: 1 } }
		},
		elevation: {
			control: { type: 'number' },
			description: 'Used only if variant="elevation". Shadow depth, corresponds to dp in the spec. It accepts values between 0 and 24 inclusive.',
			table: { defaultValue: { summary: 1 } }
		},
		variant: {
			options: ['elevation', 'outlined'],
			control: { type: 'select' },
			description: 'The variant to use. Types: "elevation", "outlined", etc.',
			table: { defaultValue: { summary: 'elevation' } }
		}
	}
} as Meta<typeof Course>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<Course {...args} />
	</div>
);

export const Base: StoryObj<typeof Course> = {
	args: {
		courseId: 129
	},
	render: template
};

export const Snippet: StoryObj<typeof Course> = {
	args: {
		courseId: 129,
		elevation: 0,
		variant: 'elevation',
		square: false
	},
	render: template
};

export const Preview: StoryObj<typeof Course> = {
	args: {
		courseId: 129,
		template: SCCourseTemplateType.PREVIEW
		//actions: <></>
	},
	render: template
};
