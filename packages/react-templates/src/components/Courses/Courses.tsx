import {Box, styled, useThemeProps} from '@mui/material';
import {SCUserContextType, useSCFetchCourse, useSCUser} from '@selfcommunity/react-core';
import {SCCourseType} from '@selfcommunity/types';
import {HTMLAttributes} from 'react';
import {PREFIX} from './constants';
import classNames from 'classnames';
import {Courses} from '@selfcommunity/react-ui';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface CoursesTemplateProps {
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
}

export default function CoursesTemplate(inProps: CoursesTemplateProps) {
  // PROPS
  const props: CoursesTemplateProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = 'courses', className = null, course = null, courseId = null} = props;

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course});
  const scUserContext: SCUserContextType = useSCUser();

  console.log(scCourse, scUserContext);

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <Courses endpoint={{url: () => '', method: 'GET'}} />
    </Root>
  );
}
