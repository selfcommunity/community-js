import {HTMLAttributes, useMemo} from 'react';
import {PREFIX} from './constants';
import {Box, styled, useThemeProps} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {SCUserContextType, useSCFetchCourse, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {CourseDashboard} from '@selfcommunity/react-ui';
import {CourseDashboardPage} from 'packages/react-ui/src/components/CourseDashboard/types';

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

  page?: CourseDashboardPage;
  onTabChange?: (page: CourseDashboardPage) => void;
  isTeacher?: boolean;
}

export default function CourseDashboardTemplate(inProps: CourseDashboardTemplateProps) {
  // PROPS
  const props: CourseDashboardTemplateProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = 'course_dashboard', className = null, course = null, courseId = null, page, onTabChange, isTeacher = false} = props;

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course});
  const scUserContext: SCUserContextType = useSCUser();

  // MEMOS
  const dashboard = useMemo(() => {
    if (/* scUserContext.user.id === scCourse.created_by.id */ isTeacher) {
      return <CourseDashboard.Teacher page={page} onTabChange={onTabChange} />;
    }

    return <CourseDashboard.Student />;
  }, [isTeacher, page, onTabChange]);

  console.log(scCourse, scUserContext);

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      {dashboard}
    </Root>
  );
}
