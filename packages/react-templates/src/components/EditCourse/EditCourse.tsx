import {HTMLAttributes} from 'react';
import {PREFIX} from './constants';
import {Box, styled, useThemeProps} from '@mui/material';
import {SCCourseType} from '@selfcommunity/types';
import {SCUserContextType, useSCFetchCourse, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {EditCourse} from '@selfcommunity/react-ui';
import {CoursePage} from 'packages/react-ui/src/components/EditCourse/types';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface EditCourseTemplateProps {
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

  page: CoursePage;
  onTabChange: (page: CoursePage) => void;
}

export default function EditCourseTemplate(inProps: EditCourseTemplateProps) {
  // PROPS
  const props: EditCourseTemplateProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {id = 'course_edit', className = null, course = null, courseId = null, page, onTabChange} = props;

  // HOOKS
  const {scCourse} = useSCFetchCourse({id: courseId, course});
  const scUserContext: SCUserContextType = useSCUser();

  console.log(scCourse, scUserContext);

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <EditCourse page={page} onTabChange={onTabChange} />
    </Root>
  );
}
