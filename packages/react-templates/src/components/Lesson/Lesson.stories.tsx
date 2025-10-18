import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Lesson from './index';

export default {
  title: 'Design System/React TEMPLATES/Lesson',
  component: Lesson
} as Meta<typeof Lesson>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <Lesson {...args}></Lesson>
  </div>
);

export const Base: StoryObj<typeof Lesson> = {
  args: {
    courseId: 1,
    sectionId: 1,
    lessonId: 1
  },
  render: template,
};

export const EditMode: StoryObj<typeof Lesson> = {
  args: {
    courseId: 20,
    sectionId: 89,
    lessonId: 101,
    editMode: true,
  },
  render: template,
};

export const PreviewMode: StoryObj<typeof Lesson> = {
  args: {
    courseId: 1,
    sectionId: 1,
    lessonId: 1,
    previewMode: true,
  },
  render: template,
};

