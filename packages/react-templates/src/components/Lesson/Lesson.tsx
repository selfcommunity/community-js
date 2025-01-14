import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {AppBar, Box, Button, Divider, Drawer, Icon, IconButton, List, Toolbar, Typography} from '@mui/material';
import {PREFIX} from './constants';
import {SCCommentsOrderBy, SCContributionType, SCCourseLessonStatusType, SCCourseLessonType, SCCourseType} from '@selfcommunity/types';
import {Link, SCRoutes, SCRoutingContextType, useSCFetchCommentObjects, useSCFetchFeedObject, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {CacheStrategies} from '@selfcommunity/utils';
import {
  CommentObjectReply,
  CommentsObject,
  CourseContentMenu,
  LessonEditForm,
  LessonObject,
  SCLessonActionsType,
  SCLessonModeType,
  ScrollContainer
} from '@selfcommunity/react-ui';
import {CourseService} from '@selfcommunity/api-services';

const messages = defineMessages({
  commentEditorPlaceholder: {
    id: 'templates.lesson.comments.editor.placeholder',
    defaultMessage: 'templates.lesson.comments.editor.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  info: `${PREFIX}-info`,
  appBarRoot: `${PREFIX}-app-bar-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  drawerHeader: `${PREFIX}-drawer-header`,
  drawerHeaderEdit: `${PREFIX}-drawer-header-edit`,
  drawerHeaderAction: `${PREFIX}-drawer-header-action`,
  drawerContent: `${PREFIX}-drawer-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

const DrawerRoot = styled(Drawer, {
  name: PREFIX,
  slot: 'DrawerRoot',
  overridesResolver: (props, styles) => styles.drawerRoot
})(({theme}) => ({}));

const drawerWidth = {
  sm: 100,
  md: 300
};

const AppBarRoot = styled(AppBar, {
  name: PREFIX,
  slot: 'AppBarRoot',
  overridesResolver: (props, styles) => styles.appBarRoot,
  shouldForwardProp: (prop) => prop !== 'open'
})<{open: boolean}>(({theme}) => ({}));

const MainContainer = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
  open?: boolean;
}>(({theme, open}) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginRight: open ? `${theme.breakpoints.up('sm') ? `${drawerWidth.md}px` : `${drawerWidth.sm}vw`}` : 0
}));

export interface LessonProps {
  /**
   * The Course title
   */
  title: string;
  /**
   * The course object
   */
  course: SCCourseType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * onArrowBack Callback
   */
  onArrowBackClick: () => any;
  /**
   * Props to spread to ScrollContainer component
   * This lib use 'react-custom-scrollbars' component to perform scrollbars
   * For more info: https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   * @default {}
   */
  ScrollContainerProps?: Record<string, any>;
  /**
   * Any other properties
   */
  [p: string]: any;
}

const initialLesson: SCCourseLessonType = {id: 1, name: 'Cinture', completed: true};

export default function Lesson(inProps: LessonProps): JSX.Element {
  // PROPS
  const props: LessonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    title = 'Course Title',
    onArrowBackClick,
    ScrollContainerProps = {},
    feedObjectId = 3078,
    feedObject = null,
    feedObjectType = SCContributionType.DISCUSSION,
    cacheStrategy = CacheStrategies.CACHE_FIRST,
    comments = [],
    CommentsObjectProps = {},
    CommentComponentProps = {variant: 'outlined'},
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  // STATE
  const [activePanel, setActivePanel] = useState<SCLessonActionsType>(null);
  const [settings, setSettings] = useState(initialLesson);
  const [updating, setUpdating] = useState(true);

  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    cacheStrategy,
    orderBy: SCCommentsOrderBy.ADDED_AT_ASC
  });

  const {obj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;

  const [lesson, setLesson] = useState({id: 1, name: 'Cinture', completed: true});

  useEffect(() => {
    if (objId && !commentsObject.comments.length) {
      commentsObject.getNextPage();
    }
  }, [objId]);
  /**
   * Load comments
   */
  function handleNext() {
    commentsObject.getNextPage();
  }

  // const isEditMode = useMemo(() => {
  //   return value.startsWith(scRoutingContext.url(SCRoutes.COURSE_EDIT_ROUTE_NAME, {}));
  // }, [value, scRoutingContext]);

  const isEditMode = false;

  const isCourseCreator = false;

  // HANDLERS

  /**
   * Handles lesson settings change
   * @param newSettings
   */
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleOpenDrawer = (panel: SCLessonActionsType) => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  };
  const handleCloseDrawer = () => {
    setActivePanel(null);
  };

  const handleLessonContentEdit = (content) => {
    console.log('.');
  };

  const handleChangeLesson = (lessonObj) => {
    setLesson(lessonObj);
  };

  /**
   * Handles Lesson Edit
   */
  const handleLessonUpdate = () => {
    setUpdating(true);
    const data: any = {settings};
    CourseService.updateCourseLesson(obj.id, obj.id, obj.id, data)
      .then(() => {
        setUpdating(false);
      })
      .catch((error) => {
        setUpdating(false);
        console.log(error);
      });
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <AppBarRoot position="fixed" open={Boolean(activePanel)} className={classes.appBarRoot}>
        <Toolbar>
          <IconButton edge="start" onClick={onArrowBackClick}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            {title}
          </Typography>
          <IconButton onClick={() => handleOpenDrawer(SCLessonActionsType.COMMENTS)}>
            <Icon>chat_bubble_outline</Icon>
          </IconButton>
          <IconButton onClick={() => handleOpenDrawer(SCLessonActionsType.LESSONS)}>
            <Icon>courses</Icon>
          </IconButton>
        </Toolbar>
      </AppBarRoot>
      <MainContainer open={Boolean(activePanel) || isEditMode}>
        <LessonObject
          lesson={lesson}
          lessonObj={obj}
          mode={isEditMode ? SCLessonModeType.EDIT : SCLessonModeType.VIEW}
          onContentChange={handleLessonContentEdit}
          onLessonNavigationChange={(l: any) => setLesson(l)}
        />
      </MainContainer>
      {(activePanel || isEditMode) && (
        <DrawerRoot className={classes.drawerRoot} anchor="right" open={Boolean(activePanel) || isEditMode} variant="persistent">
          <Box className={classNames(classes.drawerHeader, {[classes.drawerHeaderEdit]: isEditMode})}>
            {isEditMode ? (
              <>
                <Button variant="outlined" size="small" component={Link} to={scRoutingContext.url(SCRoutes.COURSE_ROUTE_NAME, obj)}>
                  <FormattedMessage id="ui.lessonEditForm.button.see" defaultMessage="ui.lessonEditForm.button.see" />
                </Button>
                <Button variant="contained" size="small" onClick={handleLessonUpdate}>
                  <FormattedMessage id="ui.lessonEditForm.button.save" defaultMessage="ui.lessonEditForm.button.save" />
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" textAlign="center">
                  <FormattedMessage id={`templates.lesson.${activePanel}`} defaultMessage={`templates.lesson.${activePanel}`} />
                </Typography>
                <IconButton className={classes.drawerHeaderAction} onClick={handleCloseDrawer}>
                  <Icon>close</Icon>
                </IconButton>
              </>
            )}
          </Box>
          <Divider />
          {isEditMode ? (
            <LessonEditForm className={classes.drawerContent} onSettingsChange={handleSettingsChange} />
          ) : (
            <ScrollContainer {...ScrollContainerProps}>
              <List className={classes.drawerContent}>
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
              id={`reply-lessonComponent-${objId}`}
              onReply={() => console.log('reply')}
              editable={true}
              key={objId}
              EditorProps={{placeholder: intl.formatMessage(messages.commentEditorPlaceholder)}}
            />
          )}
        </DrawerRoot>
      )}
    </Root>
  );
}
