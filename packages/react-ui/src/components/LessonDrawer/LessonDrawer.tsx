import React from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Divider, Drawer, Icon, IconButton, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCLessonActionsType} from '../../types';
import {FormattedMessage} from 'react-intl';
import {SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import LessonEditForm, {LessonEditFormProps} from '../LessonEditForm';
import CourseContentMenu from '../CourseContentMenu';
import ScrollContainer from '../../shared/ScrollContainer';
import LessonCommentObjects, {LessonCommentObjectsProps} from '../LessonCommentObjects';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  headerAction: `${PREFIX}-header-action`,
  headerContent: `${PREFIX}-header-content`,
  headerEdit: `${PREFIX}-header-edit`
};

const Root = styled(Drawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export interface LessonDrawerProps {
  /**
   * The course obj
   */
  course: SCCourseType;
  /**
   * The lesson obj
   */
  lesson: SCCourseLessonType;
  /**
   * The edit mode
   * @default false
   */
  editMode: boolean;
  /**
   * The preview mode
   * @default false
   */
  previewMode: boolean;
  /**
   * The active panel
   */
  activePanel: SCLessonActionsType | null;
  /**
   * Callback to handle drawer closing
   */
  handleClose: () => void;
  /**
   *  Callback fired when the lesson change
   */
  handleChangeLesson: (lesson: SCCourseLessonType, section: SCCourseSectionType) => void;
  /***
   * The LessonEditFormProps
   */
  LessonEditFormProps: LessonEditFormProps;

  /**
   * The props to spread to lesson comment objs component
   * @default {}
   */
  LessonCommentObjectsProps?: LessonCommentObjectsProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonDrawer(inProps: LessonDrawerProps): JSX.Element {
  // PROPS
  const props: LessonDrawerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    lesson,
    course,
    editMode = false,
    previewMode = false,
    activePanel = null,
    LessonCommentObjectsProps = {},
    LessonEditFormProps,
    handleClose,
    handleChangeLesson,
    ...rest
  } = props;

  return (
    <Root className={classNames(classes.root, className)} anchor="right" open={Boolean(activePanel) || editMode} variant="persistent" {...rest}>
      <Box className={classNames(classes.header, {[classes.headerEdit]: editMode})}>
        <Box className={classes.headerContent}>
          <Typography variant="h4" textAlign="center">
            {editMode ? (
              <FormattedMessage id="ui.lessonDrawer.settings" defaultMessage="ui.lessonDrawer.settings" />
            ) : (
              <FormattedMessage id={`ui.lessonDrawer.${activePanel}`} defaultMessage={`ui.lessonDrawer.${activePanel}`} />
            )}
          </Typography>
          <IconButton className={classes.headerAction} onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
      </Box>
      <Divider />
      {editMode ? (
        <LessonEditForm {...LessonEditFormProps} />
      ) : activePanel === SCLessonActionsType.COMMENTS ? (
        <LessonCommentObjects lessonObject={lesson} {...LessonCommentObjectsProps} />
      ) : (
        <ScrollContainer>
          <CourseContentMenu course={course} lesson={lesson} onLessonClick={handleChangeLesson} previewMode={previewMode} />
        </ScrollContainer>
      )}
    </Root>
  );
}
