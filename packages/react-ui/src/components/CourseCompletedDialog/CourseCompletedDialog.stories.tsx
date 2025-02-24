import type { Meta, StoryObj } from '@storybook/react';
import CourseCompletedDialog from './index';

export default {
  title: 'Design System/React UI /Course Completed Dialog',
  component: CourseCompletedDialog,
  args: {
    course: {
      id: 1,
      name: 'Accesori di Moda'
    },
    onClose: () => console.log()
  }
} as Meta<typeof CourseCompletedDialog>;

export const Base: StoryObj<typeof CourseCompletedDialog> = {};