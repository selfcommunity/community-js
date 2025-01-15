import React, {useEffect} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Box, Button, Divider, Drawer, Icon, IconButton, List, Typography, useMediaQuery, useTheme} from '@mui/material';
import {PREFIX} from './constants';
import {SCLessonActionsType} from '../../types';
import {
  Link,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  useSCFetchCommentObjects,
  useSCFetchFeedObject,
  useSCRouting
} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {SCCommentsOrderBy, SCContributionType} from '@selfcommunity/types';
import {CacheStrategies} from '@selfcommunity/utils';
import LessonEditForm from '../LessonEditForm';
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
   * The edit mode
   * @default false
   */
  editMode: boolean;
  /**
   * The active panel
   */
  activePanel: SCLessonActionsType | null;
  /**
   * Callback to handle settings update
   */
  handleUpdate: () => void;
  /**
   * Callback to handle drawer closing
   */
  handleClose: () => void;
  /**
   * Callback fired when settings change
   */
  handleSettingsChange: (settings: any) => void;
  /**
   *  Callback fired when the lesson change
   */
  handleChangeLesson: (lesson: any) => void;
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
    editMode = false,
    activePanel = null,
    feedObjectId = 3078,
    feedObject = null,
    feedObjectType = SCContributionType.DISCUSSION,
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    comments = [],
    CommentComponentProps = {variant: 'outlined'},
    CommentsObjectProps = {},
    handleUpdate,
    handleClose,
    lesson,
    handleSettingsChange,
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
  const {obj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Root className={classNames(classes.root, className)} anchor="right" open={Boolean(activePanel) || editMode} variant="persistent">
      <Box className={classNames(classes.header, {[classes.headerEdit]: editMode})}>
        {editMode ? (
          <>
            {isMobile ? (
              <>
                <Typography variant="h4" textAlign="center">
                  <FormattedMessage id="ui.lessonDrawer.settings" defaultMessage="ui.lessonDrawer.settings" />
                </Typography>
                <IconButton className={classes.headerAction} onClick={handleClose}>
                  <Icon>close</Icon>
                </IconButton>
              </>
            ) : (
              <>
                <Button variant="outlined" size="small" component={Link} to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, obj)}>
                  <FormattedMessage id="ui.lessonDrawer.button.see" defaultMessage="ui.lessonDrawer.button.see" />
                </Button>
                <Button variant="contained" size="small" onClick={handleUpdate}>
                  <FormattedMessage id="ui.lessonDrawer.button.save" defaultMessage="ui.lessonDrawer.button.save" />
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Typography variant="h4" textAlign="center">
              <FormattedMessage id={`ui.lessonDrawer.${activePanel}`} defaultMessage={`ui.lessonDrawer.${activePanel}`} />
            </Typography>
            <IconButton className={classes.headerAction} onClick={handleClose}>
              <Icon>close</Icon>
            </IconButton>
          </>
        )}
      </Box>
      <Divider />
      {editMode ? (
        <LessonEditForm className={classes.content} onSettingsChange={handleSettingsChange} />
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
              <CourseContentMenu courseId={1} lesson={lesson} onLessonClick={handleChangeLesson} />
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
