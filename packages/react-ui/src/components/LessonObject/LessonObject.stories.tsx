import type { Meta, StoryObj } from '@storybook/react';
import LessonObject from './index';

export default {
  title: 'Design System/React UI/Lesson Object',
  component: LessonObject
} as Meta<typeof LessonObject>;

const template = (args) => (
  <div style={{width: '80%'}}>
    <LessonObject {...args}></LessonObject>
  </div>
);

export const Base: StoryObj<typeof LessonObject> = {
  args: {},
  render: template
};
