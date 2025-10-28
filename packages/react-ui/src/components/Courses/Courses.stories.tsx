import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {prefetchedCourses} from './prefetchedCourses';
import Courses, { CoursesProps } from './index';

export default {
  title: 'Design System/React UI/Courses',
  component: Courses,
  argTypes: {
    showFilters: {
      control: {type: 'boolean'},
      description: 'Show/Hide filters.',
      table: {defaultValue: {summary: '1'}}
    }
  },
  args: {}
} as Meta<typeof Courses>;

const template = (args: CoursesProps) => (
  <div style={{maxWidth: 1280}}>
    <Courses {...args} />
  </div>
);

export const Base: StoryObj<typeof Courses> = {
  render: template
};

export const BasePrefetchedCourses: StoryObj<typeof Courses> = {
  args: {
    prefetchedCourses
  },
  render: template
};
