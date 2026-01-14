import React, {useContext, useMemo, useRef, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import CentralProgress from '../CentralProgress';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {useSnackbar} from 'notistack';
import classNames from 'classnames';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
  Icon,
  styled,
  Popper
} from '@mui/material';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {
  SCContext,
  SCContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCFetchLessonCommentObject
} from '@selfcommunity/react-core';
import {SCCourseCommentType, SCCourseLessonType} from '@selfcommunity/types';

const EDIT_COMMENT = '_edit_comment';
const DELETE_COMMENT = '_delete_comment';

const PREFIX = 'SCLessonCommentActionsMenu';

const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`,
  popperRoot: `${PREFIX}-popper-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-item-text`,
  subItem: `${PREFIX}-sub-item`
};

const PopperRoot = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.popperRoot
})(() => ({}));

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface LessonCommentActionsMenuProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Course Lesson obj
   * @default null
   */
  lesson: SCCourseLessonType;

  /**
   * Course CommentObject id
   * @default null
   */
  commentObjectId?: number;

  /**
   * Course Comment obj
   * @default null
   */
  commentObject: SCCourseCommentType;

  /**
   * Handle edit obj
   */
  onEdit?: (obj: SCCourseCommentType) => void;

  /**
   * Handle delete obj
   */
  onDelete?: (obj: SCCourseCommentType) => void;

  /**
   * Props to spread to popper
   * @default empty object
   */
  PopperProps?: any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function LessonCommentActionsMenu(props: LessonCommentActionsMenuProps): JSX.Element {
  // PROPS
  const {className, lesson, commentObjectId, commentObject, onEdit, onDelete, PopperProps = {}, ...rest} = props;

  // CONTEXT
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scContext: SCContextType = useContext(SCContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const {enqueueSnackbar} = useSnackbar();

  // COMMENT STATE
  const {obj: commentObj, setObj: setCommentObj} = useSCFetchLessonCommentObject({id: commentObjectId, commentObject: commentObject, lesson: lesson});

  // GENERAL POPPER STATE
  const [open, setOpen] = useState<boolean>(false);

  // CONFIRM ACTION DIALOG STATE
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<string>(null);
  const [currentActionLoading, setCurrentActionLoading] = useState<string>(null);

  // CONST
  let popperRef = useRef(null);

  /**
   * Handles open popup
   */
  function handleOpen() {
    if (scUserContext.user) {
      setOpen(true);
    } else {
      scContext.settings.handleAnonymousAction();
    }
  }

  /**
   * Closes popup
   */
  function handleClose() {
    if (popperRef.current && popperRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    if (rest.onClose) {
      rest.onClose();
    }
  }

  /**
   * Perform delete comment
   */
  const performDeleteComment = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.DeleteCourseComment.url({
            id: lesson.course_id,
            section_id: lesson.section_id,
            lesson_id: lesson.id,
            comment_id: commentObject.id
          }),
          method: Endpoints.DeleteCourseComment.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [commentObj, lesson]
  );

  /**
   * handle action
   */
  function handleAction(action) {
    if (UserUtils.isBlocked(scUserContext.user) && [EDIT_COMMENT].includes(action)) {
      // if user is blocked, deny edit and moderate
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
      return;
    }
    if (action === EDIT_COMMENT) {
      onEdit && onEdit(commentObj);
      handleClose();
    } else {
      setCurrentAction(DELETE_COMMENT);
      setOpenConfirmDialog(true);
      handleClose();
    }
  }

  /**
   * Perform additional operations at the end of single action
   */
  function performPostConfirmAction(success) {
    if (success) {
      setCurrentActionLoading(null);
      setCurrentAction(null);
      setOpenConfirmDialog(false);
      enqueueSnackbar(<FormattedMessage id="ui.lessonCommentActionMenu.actionSuccess" defaultMessage="ui.lessonCommentActionMenu.actionSuccess" />, {
        variant: 'success',
        autoHideDuration: 3000
      });
    } else {
      setCurrentActionLoading(null);
      enqueueSnackbar(<FormattedMessage id="ui.lessonCommentActionMenu.actionError" defaultMessage="ui.lessonCommentActionMenu.actionError" />, {
        variant: 'error',
        autoHideDuration: 3000
      });
    }
  }

  /**
   * Deletes a comment
   */
  function handleConfirmedAction() {
    if (commentObj && !currentActionLoading) {
      if (currentAction === DELETE_COMMENT) {
        setCurrentActionLoading(DELETE_COMMENT);
        performDeleteComment()
          .then(() => {
            onDelete && onDelete(commentObj);
            performPostConfirmAction(true);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            performPostConfirmAction(false);
          });
      }
    }
  }

  /**
   * CIf the authenticated user can modify the comment
   */
  function canModifyContribution(): boolean {
    return scUserContext.user && scUserContext.user.id === commentObj.created_by.id;
  }

  /**
   * If the authenticated user can delete the comment
   */
  function canDeleteContribution(): boolean {
    return scUserContext.user && scUserContext.user.id === commentObj.created_by.id;
  }

  /**
   * Renders comment menu content
   */
  function renderContent() {
    return (
      <Box>
        {!commentObj ? (
          <CentralProgress size={30} />
        ) : (
          <MenuList>
            {canModifyContribution() && (
              <MenuItem className={classes.subItem}>
                <ListItemIcon>
                  <Icon>edit</Icon>
                </ListItemIcon>
                <ListItemText
                  primary={<FormattedMessage id="ui.lessonCommentActionMenu.edit" defaultMessage="ui.lessonCommentActionMenu.edit" />}
                  onClick={() => handleAction(EDIT_COMMENT)}
                  classes={{root: classes.itemText}}
                />
              </MenuItem>
            )}
            {canDeleteContribution() && (
              <MenuItem className={classes.subItem}>
                <ListItemIcon>{currentActionLoading === DELETE_COMMENT ? <CircularProgress size={20} /> : <Icon>delete</Icon>}</ListItemIcon>
                <ListItemText
                  primary={<FormattedMessage id="ui.lessonCommentActionMenu.delete" defaultMessage="ui.lessonCommentActionMenu.delete" />}
                  onClick={() => handleAction(DELETE_COMMENT)}
                  classes={{root: classes.itemText}}
                />
              </MenuItem>
            )}
          </MenuList>
        )}
      </Box>
    );
  }

  /**
   * Renders component
   */
  return (
    <Root className={classNames(classes.root, className)}>
      <IconButton
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ref={(ref) => {
          popperRef.current = ref;
        }}
        aria-haspopup="true"
        onClick={handleOpen}
        className={classes.button}
        size="small">
        <Icon>more_vert</Icon>
      </IconButton>
      {open && (
        <>
          {isMobile ? (
            <SwipeableDrawer open onClose={handleClose} onOpen={handleOpen} anchor="bottom" disableSwipeToOpen>
              {renderContent()}
            </SwipeableDrawer>
          ) : (
            <PopperRoot
              open
              anchorEl={popperRef.current}
              role={undefined}
              transition
              className={classes.popperRoot}
              {...PopperProps}
              placement="bottom-end">
              {({TransitionProps, placement}) => (
                <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
                  <Paper variant={'outlined'} className={classes.paper}>
                    <ClickAwayListener onClickAway={handleClose}>{renderContent()}</ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </PopperRoot>
          )}
        </>
      )}
      {openConfirmDialog && (
        <ConfirmDialog
          open={openConfirmDialog}
          onConfirm={handleConfirmedAction}
          isUpdating={Boolean(currentActionLoading)}
          onClose={() => setOpenConfirmDialog(false)}
        />
      )}
    </Root>
  );
}
