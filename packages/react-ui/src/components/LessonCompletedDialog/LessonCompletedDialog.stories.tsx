import type { Meta, StoryObj } from '@storybook/react';
import LessonCompletedDialog from './index';

export default {
  title: 'Design System/React UI /Lesson Completed Dialog',
  component: LessonCompletedDialog,
  args: {
    course: {
      name: 'Accesori di Moda'
    },
    open: true,
    onAction: () => console.log(),
    onClose: () => console.log()
  }
} as Meta<typeof LessonCompletedDialog>;

export const Base: StoryObj<typeof LessonCompletedDialog> = {};