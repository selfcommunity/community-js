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
  ListItem,
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
import {SCContextType, SCRoutes, SCRoutingContextType, useSCContext, useSCFetchCommentObjects, useSCRouting} from '@selfcommunity/react-core';
import LessonObject from '../LessonObject';
import {SCLessonActionsType} from '../../types/course';
import ScrollContainer from '../../shared/ScrollContainer';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {SCCommentsOrderBy} from '@selfcommunity/react-ui';
import {CacheStrategies} from '@selfcommunity/utils';
import CommentsObject from '../CommentsObject';
import CommentObjectReply from '../CommentObjectReply';

const classes = {
  root: `${PREFIX}-root`,
  info: `${PREFIX}-info`,
  settings: `${PREFIX}-settings`,
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

  // HANDLERS

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleIconClick = (panel: SCLessonActionsType) => {
    setActivePanel((prevPanel) => (prevPanel === panel ? null : panel));
  };
  const handleCloseDrawer = () => {
    setActivePanel(null);
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" onClick={onArrowBackClick}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            {title}
          </Typography>
          <IconButton onClick={() => handleIconClick(SCLessonActionsType.COMMENTS)}>
            <Icon>chat_bubble_outline</Icon>
          </IconButton>
          <IconButton onClick={() => handleIconClick(SCLessonActionsType.LESSONS)}>
            <Icon>courses</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box className={classes.info}>
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage id="ui.lessonComponent.lessonNumber" defaultMessage="ui.lessonComponent.lessonNumber" values={{from: 1, to: 5}} />
        </Typography>
      </Box>
      <LessonObject
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
      {(activePanel || isEditMode) && (
        <DrawerRoot className={classes.drawerRoot} anchor="right" open={Boolean(activePanel) || isEditMode} onClose={handleCloseDrawer}>
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
                  <>
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
                    <CommentObjectReply
                      showAvatar={false}
                      replyIcon={true}
                      id={`reply-lessonComponent-${objId}`}
                      onReply={() => console.log('reply')}
                      editable={true}
                      key={objId}
                    />
                  </>
                ) : (
                  <>
                    <ListItemButton onClick={handleToggle} className={classes.listItem} disableRipple>
                      <ListItemIcon className={classes.listItemIcon}>{open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}</ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {items.map((item, index) => (
                          <ListItem key={index} className={classes.item}>
                            <ListItemIcon className={classes.itemIcon}>
                              {item.completed ? (
                                <Icon className={classes.iconComplete}>circle_checked</Icon>
                              ) : (
                                <Icon className={classes.iconIncomplete}>fiber_manual_record</Icon>
                              )}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </>
                )}
              </List>
            </ScrollContainer>
          )}
        </DrawerRoot>
      )}
    </Root>
  );
}
