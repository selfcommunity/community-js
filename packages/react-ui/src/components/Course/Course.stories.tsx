import type { Meta, StoryObj } from '@storybook/react';
import { SCCourseTemplateType } from '../../types/course';
import CoursePlaceholder from './Placeholder';

export default {
	title: 'Design System/React UI/CoursePlaceholder',
	component: CoursePlaceholder,
	argTypes: {
		courseId: {
			control: { type: 'number' },
			description: 'CoursePlaceholder Id',
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
} as Meta<typeof CoursePlaceholder>;

const template = (args) => (
	<div style={{ maxWidth: 400 }}>
		<CoursePlaceholder {...args} />
	</div>
);

export const Base: StoryObj<typeof CoursePlaceholder> = {
	args: {},
	render: template
};

