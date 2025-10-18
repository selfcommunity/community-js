import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LessonDrawer from './index';

export default {
  title: 'Design System/React UI/Lesson Drawer',
  component: LessonDrawer
} as Meta<typeof LessonDrawer>;

const template = (args) => (
  <div style={{width: '80%'}}>
    <LessonDrawer {...args}></LessonDrawer>
  </div>
);

export const Base: StoryObj<typeof LessonDrawer> = {
  args: {},
  render: template
};
