import {HTMLAttributes} from 'react';
import {PREFIX} from './constants';
import {Box, styled, useThemeProps} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {useSCFetchCourse} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {EditCourse as Edit} from '@selfcommunity/react-ui';
import {CourseInfoViewType} from '@selfcommunity/api-services';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EditCourseProps {
  /**
   * Id of the feed object
   * @default 'course_edit'
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

  page: 'lessons' | 'customize' | 'users' | 'options';
  onTabChange: (page: 'lessons' | 'customize' | 'users' | 'options') => void;
}

export default function EditCourse(inProps: EditCourseProps) {
  // PROPS
  const props: EditCourseProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = 'course_edit', className = null, course = null, courseId = null, page, onTabChange} = props;

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course, params: {view: CourseInfoViewType.EDIT}});

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <Edit course={scCourse} page={page} onTabChange={onTabChange} />
    </Root>
  );
}
