import React, {useContext, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Popper from '@mui/material/Popper';
import {
  Endpoints,
  http,
  Logger,
  SCCommentType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCUserContext,
  SCUserContextType,
  useSCFetchCommentObject
} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import SelectedIcon from '@mui/icons-material/CheckCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {ClickAwayListener, Divider, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography} from '@mui/material';

import {REPORT_AGGRESSIVE, REPORT_OFFTOPIC, REPORT_POORCONTENT, REPORT_SPAM, REPORT_VULGAR, REPORTS} from '../../../constants/Flagging';
import CentralProgress from '../../../shared/CentralProgress';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';

const PREFIX = 'SCCommentActionsMenu';

const classes = {
  button: `${PREFIX}-button`,
  popper: `${PREFIX}-popper`,
  paper: `${PREFIX}-paper`,
  footer: `${PREFIX}-footer`,
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-itemText`,
  selectedIcon: `${PREFIX}-selectedIcon`
};

const Root = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  zIndex: 2,

  [`& .${classes.paper}`]: {
    maxWidth: 200
  },

  [`& .${classes.footer}`]: {
    padding: '8px'
  },

  [`& .${classes.item}`]: {
    borderBottom: '1px solid #e5e5e5'
  },

  [`& .${classes.itemText}`]: {
    marginLeft: 7
  },

  [`& .${classes.selectedIcon}`]: {
    marginLeft: -17,
    position: 'relative',
    left: 5,
    '&.MuiListItemIcon-root': {
      minWidth: '21px'
    },
    '& svg': {
      fontSize: '1.2rem'
    }
  }
}));

const messages = defineMessages({
  title: {
    id: 'ui.reportingMenu.title',
    defaultMessage: 'ui.reportingMenu.title'
  },
  spam: {
    id: 'ui.reportingMenu.spam',
    defaultMessage: 'ui.reportingMenu.spam'
  },
  aggressive: {
    id: 'ui.reportingMenu.aggressive',
    defaultMessage: 'ui.reportingMenu.aggressive'
  },
  vulgar: {
    id: 'ui.reportingMenu.vulgar',
    defaultMessage: 'ui.reportingMenu.vulgar'
  },
  poorContent: {
    id: 'ui.reportingMenu.poorContent',
    defaultMessage: 'ui.reportingMenu.poorContent'
  },
  offtopic: {
    id: 'ui.reportingMenu.offtopic',
    defaultMessage: 'ui.reportingMenu.offtopic'
  },
  footer: {
    id: 'ui.reportingMenu.footer',
    defaultMessage: 'ui.reportingMenu.footer'
  }
});

export default function CommentActionsMenu({
  commentObjectId = null,
  commentObject = null,
  feedObjectId = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  onDelete = null,
  onRestore = null,
  ...rest
}: {
  commentObjectId?: number;
  commentObject?: SCCommentType;
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  onDelete?: (SCCommentType) => void;
  onRestore?: (SCCommentType) => void;
  [p: string]: any;
}): JSX.Element {
  const intl = useIntl();
  const scUser: SCUserContextType = useContext(SCUserContext);
  const {obj, setObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});
  const [flagType, setFlagType] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState<boolean>(false);
  const [isDeletingComment, setIsDeletingComment] = useState<boolean>(false);
  const [openRestoreCommentDialog, setOpenRestoreCommentDialog] = useState<boolean>(false);
  const [isRestoringComment, setIsRestoringComment] = useState<boolean>(false);
  let popperRef = useRef(null);

  /**
   * Get Status Flag
   */
  const fetchFetchFlagStatus = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.FlagStatus.url({type: 'comment', id: obj.id}),
          method: Endpoints.FlagStatus.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Perform Flag
   */
  const performFlag = useMemo(
    () => (type) => {
      return http
        .request({
          url: Endpoints.Flag.url({type: 'comment', id: obj.id}),
          method: Endpoints.Flag.method,
          data: {flag_type: type}
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Fetch initial flag status
   */
  function fetchFlagStatus() {
    if (obj && !isLoading) {
      setIsLoading(true);
      fetchFetchFlagStatus()
        .then((data) => {
          setFlagType(data['flag_type']);
          setIsLoading(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Perform contribute flagging by authenticated user
   * @param type
   */
  function handleFlag(type) {
    if (obj && !isLoading && !isFlagging && type) {
      setIsFlagging(true);
      performFlag(type)
        .then((data) => {
          setFlagType(flagType === type ? null : type);
          setIsFlagging(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Perform Delete comment
   */
  const performDeleteComment = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.CommentDelete.url({id: obj.id}),
          method: Endpoints.CommentDelete.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handle delete comment
   */
  function deleteComment() {
    if (obj && !isLoading) {
      setIsDeletingComment(true);
      performDeleteComment()
        .then((data) => {
          onDelete && onDelete(commentObject);
          setIsDeletingComment(false);
          setOpenDeleteCommentDialog(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Perform Restore comment
   */
  const performRestoreComment = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.CommentRestore.url({id: obj.id}),
          method: Endpoints.CommentRestore.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handle restore comment
   */
  function restoreComment() {
    if (obj && !isLoading) {
      setIsRestoringComment(true);
      performRestoreComment()
        .then((data) => {
          onRestore && onRestore(commentObject);
          setIsRestoringComment(false);
          setOpenRestoreCommentDialog(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Handle open flagging popup, retrive always the flag status (if exist)
   */
  function handleOpenMenu() {
    setOpen(true);
    fetchFlagStatus();
  }

  /**
   * Close the flagging popup
   */
  function handleCloseMenu() {
    if (popperRef.current && popperRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    if (rest.onClose) {
      rest.onClose();
    }
  }

  /**
   * Return flag label based on type
   * @param flagType
   * @return {*}
   */
  function getFlagName(flagType) {
    let name;
    switch (flagType) {
      case REPORT_SPAM:
        name = intl.formatMessage(messages.spam);
        break;
      case REPORT_AGGRESSIVE:
        name = intl.formatMessage(messages.aggressive);
        break;
      case REPORT_VULGAR:
        name = intl.formatMessage(messages.vulgar);
        break;
      case REPORT_POORCONTENT:
        name = intl.formatMessage(messages.poorContent);
        break;
      case REPORT_OFFTOPIC:
        name = intl.formatMessage(messages.offtopic);
        break;
      default:
        break;
    }
    return name;
  }

  /**
   * Render single flag item
   * @return {[{REPORTS}]}
   */
  function renderFlags() {
    return REPORTS.map((flag, index) => (
      <MenuItem key={index} className={classes.item} disabled={isFlagging}>
        <ListItemIcon classes={{root: classes.selectedIcon}}>{flagType === flag && <SelectedIcon color="secondary" />}</ListItemIcon>
        <ListItemText primary={getFlagName(flag)} onClick={() => handleFlag(flag)} classes={{root: classes.itemText}} />
      </MenuItem>
    ));
  }

  return (
    <React.Fragment>
      <IconButton
        ref={(ref) => {
          popperRef.current = ref;
        }}
        aria-haspopup="true"
        onClick={handleOpenMenu}
        className={classes.button}
        size="medium">
        <MoreVertIcon />
      </IconButton>
      <Root open={open} anchorEl={popperRef.current} role={undefined} transition className={classes.popper} placement="bottom-start">
        {({TransitionProps, placement}) => (
          <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
            <Paper variant={'outlined'} className={classes.paper}>
              <ClickAwayListener onClickAway={handleCloseMenu}>
                {isLoading ? (
                  <CentralProgress size={30} />
                ) : (
                  <MenuList>
                    <MenuItem onClick={handleCloseMenu}>
                      <FormattedMessage
                        id="ui.commentObject.commentActionsMenu.permanentLink"
                        defaultMessage="ui.commentObject.commentActionsMenu.permanentLink"
                      />
                    </MenuItem>
                    {scUser.user.id === obj.author.id ? (
                      <>
                        <MenuItem onClick={handleCloseMenu}>
                          <FormattedMessage id="ui.commentObject.commentActionsMenu.edit" defaultMessage="ui.commentObject.commentActionsMenu.edit" />
                        </MenuItem>
                        {obj.deleted && scUser.user && (
                          <MenuItem onClick={() => setOpenRestoreCommentDialog(true)}>
                            <FormattedMessage
                              id="ui.commentObject.commentActionsMenu.restore"
                              defaultMessage="ui.commentObject.commentActionsMenu.restore"
                            />
                          </MenuItem>
                        )}
                        {!obj.deleted && (
                          <MenuItem onClick={() => setOpenDeleteCommentDialog(true)}>
                            <FormattedMessage
                              id="ui.commentObject.commentActionsMenu.delete"
                              defaultMessage="ui.commentObject.commentActionsMenu.delete"
                            />
                          </MenuItem>
                        )}
                      </>
                    ) : (
                      <>
                        <Divider />
                        <Typography variant={'body1'} sx={{paddingLeft: '8px', fontWeight: '700'}} gutterBottom>
                          {intl.formatMessage(messages.title)}
                        </Typography>
                        {renderFlags()}
                        <Typography variant={'caption'} component={'div'} className={classes.footer}>
                          {intl.formatMessage(messages.footer)}
                        </Typography>
                      </>
                    )}
                  </MenuList>
                )}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Root>
      {(openDeleteCommentDialog || openRestoreCommentDialog) && (
        <ConfirmDialog
          open={openDeleteCommentDialog || openRestoreCommentDialog}
          title={
            openRestoreCommentDialog ? (
              <FormattedMessage
                id="ui.commentObject.commentActionsMenu.restoreCommentTitleDialog"
                defaultMessage="ui.commentObject.commentActionsMenu.restoreCommentTitleDialog"
              />
            ) : (
              <FormattedMessage
                id="ui.commentObject.commentActionsMenu.deleteCommentTitleDialog"
                defaultMessage="ui.commentObject.commentActionsMenu.deleteCommentTitleDialog"
              />
            )
          }
          content={
            openRestoreCommentDialog ? (
              <FormattedMessage
                id="ui.commentObject.commentActionsMenu.restoreCommentContentDialog"
                defaultMessage="ui.commentObject.commentActionsMenu.restoreCommentContentDialog"
              />
            ) : (
              <FormattedMessage
                id="ui.commentObject.commentActionsMenu.deleteCommentContentDialog"
                defaultMessage="ui.commentObject.commentActionsMenu.deleteCommentContentDialog"
              />
            )
          }
          btnConfirm={<FormattedMessage id="ui.changePicture.dialog.confirm" defaultMessage="ui.changePicture.dialog.confirm" />}
          onConfirm={openRestoreCommentDialog ? restoreComment : deleteComment}
          isUpdating={isDeletingComment || isRestoringComment}
          onClose={openRestoreCommentDialog ? () => setOpenRestoreCommentDialog(false) : () => setOpenDeleteCommentDialog(false)}
        />
      )}
    </React.Fragment>
  );
}
