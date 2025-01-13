import type { Meta, StoryObj } from '@storybook/react';
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

export const Base: StoryObj<Lesson> = {
  args: {},
  render: template
};
