import type { Meta, StoryObj } from '@storybook/react';
import LessonReleaseMenu from './index';

export default {
  title: 'Design System/React UI/Lesson Release Menu',
  component: LessonReleaseMenu
} as Meta<typeof LessonReleaseMenu>;

const template = (args) => (
  <div style={{width: 400}}>
    <LessonReleaseMenu {...args}></LessonReleaseMenu>
  </div>
);

export const Base: StoryObj<LessonReleaseMenu> = {
  args: {},
  render: template
};
