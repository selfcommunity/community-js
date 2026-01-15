import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LessonAppbar, { LessonAppbarProps } from './index';

export default {
  title: 'Design System/React UI/Lesson Appbar',
  component: LessonAppbar
} as Meta<typeof LessonAppbar>;

const template = (args: LessonAppbarProps) => (
  <div style={{width: '80%'}}>
    <LessonAppbar {...args}></LessonAppbar>
  </div>
);

export const Base: StoryObj<typeof LessonAppbar> = {
  args: {},
  render: template
};
