import type { Meta, StoryObj } from '@storybook/react';
import CourseParticipantsButton from './index';

export default {
  title: 'Design System/React UI/Course Participants Button ',
  component: CourseParticipantsButton,
  args: {
    courseId: 129
  }
} as Meta<typeof CourseParticipantsButton>;

export const Base: StoryObj<typeof CourseParticipantsButton> = {}
