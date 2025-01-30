import React, {useEffect} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Divider, Drawer, Icon, IconButton, List, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCLessonActionsType} from '../../types';
import {useSCFetchCommentObjects} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCCommentsOrderBy, SCContributionType, SCCourseLessonType, SCCourseSectionType, SCCourseType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import LessonEditForm, {LessonEditFormProps} from '../LessonEditForm';
import CommentsObject from '../CommentsObject';
import CourseContentMenu from '../CourseContentMenu';
import CommentObjectReply from '../CommentObjectReply';
import ScrollContainer from '../../shared/ScrollContainer';

const messages = defineMessages({
  commentEditorPlaceholder: {
    id: 'ui.lessonDrawer.comments.editor.placeholder',
    defaultMessage: 'ui.lessonDrawer.comments.editor.placeholder'
  }
});

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
    editMode = false,
    activePanel = null,
    feedObjectId = 3078,
    feedObject = null,
    feedObjectType = SCContributionType.DISCUSSION,
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    comments = [],
    CommentComponentProps = {variant: 'outlined'},
    CommentsObjectProps = {},
    LessonEditFormProps,
    handleClose,
    handleChangeLesson,
    ...rest
  } = props;

  // STATE
  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    cacheStrategy,
    orderBy: SCCommentsOrderBy.ADDED_AT_ASC
  });
  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;

  // INTL
  const intl = useIntl();

  // EFFECTS
  useEffect(() => {
    if (objId && !commentsObject.comments.length) {
      commentsObject.getNextPage();
    }
  }, [objId]);

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
        <ScrollContainer>
          <List className={classes.content}>
            {activePanel === SCLessonActionsType.COMMENTS ? (
              <CommentsObject
                feedObject={commentsObject.feedObject}
                comments={commentsObject.comments}
                startComments={comments}
                next={commentsObject.next}
                isLoadingNext={commentsObject.isLoadingNext}
                handleNext={handleNext}
                totalLoadedComments={commentsObject.comments.length + comments.length}
                totalComments={commentsObject.feedObject.comment_count}
                hideAdvertising
                {...CommentsObjectProps}
                CommentComponentProps={{
                  ...{showActions: false},
                  ...{showUpperDateTime: true},
                  ...(CommentsObjectProps.CommentComponentProps ? CommentsObjectProps.CommentComponentProps : {}),
                  ...CommentComponentProps,
                  ...{cacheStrategy}
                }}
                inPlaceLoadMoreContents={false}
              />
            ) : (
              <CourseContentMenu course={course} lesson={LessonEditFormProps.lesson} onLessonClick={handleChangeLesson} />
            )}
          </List>
        </ScrollContainer>
      )}
      {activePanel === SCLessonActionsType.COMMENTS && (
        // TODO: handle message reply component
        <CommentObjectReply
          showAvatar={false}
          replyIcon={true}
          id={`reply-lessonDrawer-${objId}`}
          onReply={() => console.log('reply')}
          editable={true}
          key={objId}
          EditorProps={{placeholder: intl.formatMessage(messages.commentEditorPlaceholder)}}
        />
      )}
    </Root>
  );
}
