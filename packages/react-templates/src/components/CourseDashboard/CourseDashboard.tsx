import {HTMLAttributes} from 'react';
import {PREFIX} from './constants';
import {Box, styled, useThemeProps} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {useSCFetchCourse} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {CourseDashboard} from '@selfcommunity/react-ui';
import {CourseInfoViewType} from '@selfcommunity/api-services';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface CourseDashboardTemplateProps {
  /**
   * Id of the feed object
   * @default 'course_dashboard'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: HTMLAttributes<HTMLDivElement>['className'];

  /**
   * Course Object
   * @default null
   */
  course?: SCCourseType;

  /**
   * Id of the course for filter the feed
   * @default null
   */
  courseId?: number;

  page?: 'students' | 'comments';
  onTabChange?: (page: 'students' | 'comments') => void;
  viewDashboard?: boolean;
}

export default function CourseDashboardTemplate(inProps: CourseDashboardTemplateProps) {
  // PROPS
  const props: CourseDashboardTemplateProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = 'course_dashboard', className = null, course = null, courseId = null, page, onTabChange, viewDashboard} = props;

  // HOOKS
  const {scCourse, error} = useSCFetchCourse({
    id: courseId,
    course,
    params: {view: viewDashboard ? CourseInfoViewType.DASHBOARD : CourseInfoViewType.USER}
  });

  if (error) {
    return null;
  }

  if (viewDashboard) {
    return (
      <Root id={id} className={classNames(classes.root, className)}>
        <CourseDashboard.Teacher course={scCourse} page={page} onTabChange={onTabChange} />
      </Root>
    );
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <CourseDashboard.Student course={scCourse} />
    </Root>
  );
}
