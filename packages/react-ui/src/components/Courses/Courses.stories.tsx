import type { Meta, StoryObj } from '@storybook/react';
import {prefetchedCourses} from './prefetchedCourses';
import Courses from './index';
import CoursesSkeleton from './Skeleton';
import { Endpoints } from '@selfcommunity/api-services';
import {SCCourseTemplateType} from '../../types/course';

export default {
  title: 'Design System/React UI/Courses',
  component: Courses,
  argTypes: {
    showFilters: {
      control: {type: 'boolean'},
      description: 'Show/Hide filters.',
      table: {defaultValue: {summary: 1}}
    }
  },
  args: {
    showFilters: true,
  }
} as Meta<typeof Courses>;

const template = (args) => (
  <div style={{maxWidth: 1280}}>
    <Courses {...args} />
  </div>
);

export const Base: StoryObj<CoursesSkeleton> = {
  render: template
};

export const MyCourses: StoryObj<Courses> = {
	args: {
    endpoint: Endpoints.GetUserEvents,
		general: false,
		showFilters: true,
	},
	render: template
};

export const MyCoursesCards: StoryObj<Courses> = {
	args: {
		endpoint: Endpoints.GetUserEvents,
		general: false,
		showFilters: true,
		GridContainerComponentProps: {spacing: {md: 3}},
		GridItemComponentProps: {md: 3},
		CourseComponentProps: {template: SCCourseTemplateType.PREVIEW},
		CourseSkeletonComponentProps: {template: SCCourseTemplateType.PREVIEW},
		CoursesSkeletonComponentProps: {
			eventsNumber: 4,
			GridContainerComponentProps: {spacing: {md: 3}},
			GridItemComponentProps: {md: 3}
		},
	},
	render: template
};

export const BasePrefetchedCourses: StoryObj<Courses> = {
  args: {
    prefetchedCourses
  },
  render: template
};
