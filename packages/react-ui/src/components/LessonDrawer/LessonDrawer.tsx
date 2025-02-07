import React, {useEffect} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Divider, Drawer, Icon, IconButton, List, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCLessonActionsType} from '../../types';
import {useSCFetchLessonCommentObjects} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import {SCCommentsOrderBy, SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import LessonEditForm, {LessonEditFormProps} from '../LessonEditForm';
import CourseContentMenu from '../CourseContentMenu';
import ScrollContainer from '../../shared/ScrollContainer';
import LessonCommentObjects, {LessonCommentObjectsProps} from '../LessonCommentObjects';
import {useInView} from 'react-intersection-observer';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  headerEdit: `${PREFIX}-header-edit`,
  headerAction: `${PREFIX}-header-action`,
  content: `${PREFIX}-content`
};

const Root = styled(Drawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(({theme}) => ({}));

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
   * The props to spread to comment component
   * @default {}
   */
  CommentObjectsProps?: LessonCommentObjectsProps;
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
    course,
    lesson,
    editMode = false,
    activePanel = null,
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    CommentObjectsProps = {},
    LessonEditFormProps,
    page = 1,
    commentsPageCount = 5,
    commentsOrderBy = SCCommentsOrderBy.ADDED_AT_ASC,
    handleClose,
    handleChangeLesson,
    ...rest
  } = props;
  const {inView} = useInView({triggerOnce: true});
  // STATE
  const commentsObject = useSCFetchLessonCommentObjects({
    id: lesson.id,
    lessonObject: lesson,
    offset: (page - 1) * commentsPageCount,
    pageSize: commentsPageCount,
    orderBy: commentsOrderBy,
    cacheStrategy
  });
  const objId = commentsObject.lessonObject ? commentsObject.lessonObject.id : null;

  // EFFECTS
  useEffect(() => {
    if (objId && !commentsObject.comments.length && activePanel === SCLessonActionsType.COMMENTS && inView) {
      commentsObject.getNextPage();
    }
  }, [objId, commentsObject.comments.length, activePanel, inView]);

  // HANDLERS
  function handleNext() {
    commentsObject.getNextPage();
  }

  return (
    <Root className={classNames(classes.root, className)} anchor="right" open={Boolean(activePanel) || editMode} variant="persistent" {...rest}>
      <Box className={classNames(classes.header, {[classes.headerEdit]: editMode})}>
        <>
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
        </>
      </Box>
      <Divider />
      {editMode ? (
        <LessonEditForm className={classes.content} {...LessonEditFormProps} />
      ) : (
        <List className={classes.content}>
          {activePanel === SCLessonActionsType.COMMENTS ? (
            <LessonCommentObjects
              lessonObject={commentsObject.lessonObject}
              comments={commentsObject.comments}
              next={commentsObject.next}
              isLoadingNext={commentsObject.isLoadingNext}
              handleNext={handleNext}
              page={commentsObject.page}
              nextPage={commentsObject.nextPage}
              onUpdate={commentsObject.updateLessonComments}
              {...CommentObjectsProps}
            />
          ) : (
            <ScrollContainer>
              <CourseContentMenu course={course} lesson={LessonEditFormProps.lesson} onLessonClick={handleChangeLesson} />
            </ScrollContainer>
          )}
        </List>
      )}
    </Root>
  );
}
