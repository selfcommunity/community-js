import type { Meta, StoryObj } from '@storybook/react';
import LessonComponent from './index';

export default {
  title: 'Design System/React UI/Lesson Component',
  component: LessonComponent
} as Meta<typeof LessonComponent>;

const template = (args) => (
  <div style={{width: '100%'}}>
    <LessonComponent {...args}></LessonComponent>
  </div>
);

export const Base: StoryObj<LessonComponent> = {
  args: {},
  render: template
};
