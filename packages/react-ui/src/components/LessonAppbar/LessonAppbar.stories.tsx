import type { Meta, StoryObj } from '@storybook/react';
import LessonAppbar from './index';

export default {
  title: 'Design System/React UI/Lesson Appbar',
  component: LessonAppbar
} as Meta<typeof LessonAppbar>;

const template = (args) => (
  <div style={{width: '80%'}}>
    <LessonAppbar {...args}></LessonAppbar>
  </div>
);

export const Base: StoryObj<typeof LessonAppbar> = {
  args: {},
  render: template
};
