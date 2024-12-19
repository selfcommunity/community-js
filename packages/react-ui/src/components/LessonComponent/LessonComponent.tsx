import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  Toolbar,
  Typography
} from '@mui/material';
import {PREFIX} from './constants';
import {SCContributionType, SCCourseStatusType, SCCourseType} from '@selfcommunity/types';
import {SCRoutes, SCRoutingContextType, useSCFetchCommentObjects, useSCFetchFeedObject, useSCRouting} from '@selfcommunity/react-core';
import LessonObject from '../LessonObject';
import {SCLessonActionsType} from '../../types/course';
import ScrollContainer from '../../shared/ScrollContainer';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {SCCommentsOrderBy} from '@selfcommunity/react-ui';
import {CacheStrategies} from '@selfcommunity/utils';
import CommentsObject from '../CommentsObject';
import CommentObjectReply from '../CommentObjectReply';

const messages = defineMessages({
  commentEditorPlaceholder: {
    id: 'ui.lessonComponent.comments.editor.placeholder',
    defaultMessage: 'ui.lessonComponent.comments.editor.placeholder'
  }
});

const classes = {
  root: `${PREFIX}-root`,
  info: `${PREFIX}-info`,
  settings: `${PREFIX}-settings`,
  appBarRoot: `${PREFIX}-app-bar-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  drawerHeader: `${PREFIX}-drawer-header`,
  drawerHeaderEdit: `${PREFIX}-drawer-header-edit`,
  drawerHeaderAction: `${PREFIX}-drawer-header-action`,
  drawerContent: `${PREFIX}-drawer-content`,
  listItem: `${PREFIX}-list-item`,
  listItemIcon: `${PREFIX}-list-item-icon`,
  item: `${PREFIX}-item`,
  itemIcon: `${PREFIX}-item-icon`,
  iconIncomplete: `${PREFIX}-icon-incomplete`,
  iconComplete: `${PREFIX}-icon-complete`
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
  sm: '100vw',
  md: 300
};

const AppBarRoot = styled(AppBar, {
  name: PREFIX,
  slot: 'AppBarRoot',
  overridesResolver: (props, styles) => styles.appBarRoot,
  shouldForwardProp: (prop) => prop !== 'open'
})(({theme}) => ({}));

const MainContainer = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
  open?: boolean;
}>(({theme, open}) => ({
  flexGrow: 1,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginRight: open ? `calc(100% - ${theme.breakpoints.up('sm') ? drawerWidth.md : drawerWidth.sm})` : 0
}));

export interface LessonComponentProps {
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

export default function LessonComponent(inProps: LessonComponentProps): JSX.Element {
  // PROPS
  const props: LessonComponentProps = useThemeProps({
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
  const [value, setValue] = useState<SCCourseStatusType>(SCCourseStatusType.DRAFT);

  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const commentsObject = useSCFetchCommentObjects({
    id: feedObjectId,
    feedObject,
    feedObjectType,
    cacheStrategy,
    orderBy: SCCommentsOrderBy.ADDED_AT_ASC
  });

  const {obj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const objId = commentsObject.feedObject ? commentsObject.feedObject.id : null;

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

  const items = [
    {label: 'Cinture', completed: true},
    {label: 'Sciarpe', completed: false},
    {label: 'Orologi', completed: false}
  ];

  const isEditMode = useMemo(() => {
    return value.startsWith(scRoutingContext.url(SCRoutes.COURSE_EDIT_ROUTE_NAME, {}));
  }, [value, scRoutingContext]);

  const isCourseCreator = true;

  // HANDLERS

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleOpenDrawer = (panel: SCLessonActionsType) => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  };
  const handleCloseDrawer = () => {
    setActivePanel(null);
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
      <MainContainer open={Boolean(activePanel)}>
        <Box className={classes.info}>
          <Typography variant="body2" color="text.secondary">
            <FormattedMessage id="ui.lessonComponent.lessonNumber" defaultMessage="ui.lessonComponent.lessonNumber" values={{from: 1, to: 5}} />
          </Typography>
        </Box>
        <LessonObject
          lessonObj={obj}
          endActions={
            // TODO: add disable conditions to navigation buttons and right values to the translation above
            <Box>
              <IconButton disabled={true}>
                <Icon>arrow_back</Icon>
              </IconButton>
              <IconButton>
                <Icon>arrow_next</Icon>
              </IconButton>
            </Box>
          }
        />
      </MainContainer>
      {(activePanel || isEditMode) && (
        <DrawerRoot className={classes.drawerRoot} anchor="right" open={Boolean(activePanel) || isEditMode} variant="persistent">
          <Box className={classNames(classes.drawerHeader, {[classes.drawerHeaderEdit]: isEditMode})}>
            {isEditMode ? (
              <>
                <Button variant="outlined" size="small" onClick={handleCloseDrawer}>
                  <FormattedMessage id="ui.lessonComponent.edit.button.see" defaultMessage="ui.lessonComponent.edit.button.see" />
                </Button>
                <Button variant="contained" size="small" onClick={handleCloseDrawer}>
                  <FormattedMessage id="ui.lessonComponent.edit.button.save" defaultMessage="ui.lessonComponent.edit.button.save" />
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h4" textAlign="center">
                  <FormattedMessage id={`ui.lessonComponent.${activePanel}`} defaultMessage={`ui.lessonComponent.${activePanel}`} />
                </Typography>
                <IconButton className={classes.drawerHeaderAction} onClick={handleCloseDrawer}>
                  <Icon>close</Icon>
                </IconButton>
              </>
            )}
          </Box>
          <Divider />
          {isEditMode ? (
            <Box className={classes.drawerContent}>
              <FormControl>
                <FormLabel id="status">
                  <FormattedMessage id="ui.lessonComponent.edit.status.title" defaultMessage="ui.lessonComponent.edit.status.title" />
                </FormLabel>
                <RadioGroup
                  aria-labelledby="course-status-radio-buttons-group"
                  name="course-status-radio-buttons-group"
                  value={value}
                  onChange={handleChange}>
                  <FormControlLabel
                    value={SCCourseStatusType.DRAFT}
                    control={<Radio />}
                    label={<FormattedMessage id="ui.lessonComponent.edit.status.draft" defaultMessage="ui.lessonComponent.edit.status.draft" />}
                  />
                  <FormControlLabel
                    value={SCCourseStatusType.PUBLISHED}
                    control={<Radio />}
                    label={
                      <FormattedMessage id="ui.lessonComponent.edit.status.published" defaultMessage="ui.lessonComponent.edit.status.published" />
                    }
                  />
                </RadioGroup>
              </FormControl>
              <FormControl className={classes.settings}>
                <FormLabel id="settings">
                  <FormattedMessage id="ui.lessonComponent.edit.settings.title" defaultMessage="ui.lessonComponent.edit.settings.title" />
                </FormLabel>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <FormattedMessage
                      id="ui.lessonComponent.edit.settings.enableComments"
                      defaultMessage="ui.lessonComponent.edit.settings.enableComments"
                    />
                  }
                />
              </FormControl>
            </Box>
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
                  <>
                    <ListItemButton onClick={handleToggle} className={classes.listItem} disableRipple>
                      <ListItemIcon className={classes.listItemIcon}>{open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}</ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {items.map((item, index) => (
                          // TODO: on click set the lesson object to next id
                          <ListItemButton key={index} className={classes.item} onClick={() => console.log(item)}>
                            {isCourseCreator && (
                              <ListItemIcon className={classes.itemIcon}>
                                {item.completed ? (
                                  <Icon className={classes.iconComplete}>circle_checked</Icon>
                                ) : (
                                  <Icon className={classes.iconIncomplete}>fiber_manual_record</Icon>
                                )}
                              </ListItemIcon>
                            )}
                            <ListItemText primary={item.label} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </>
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
