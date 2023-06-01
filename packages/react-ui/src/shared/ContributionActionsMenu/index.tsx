import React, {useContext, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Popper from '@mui/material/Popper';
import Icon from '@mui/material/Icon';
import CentralProgress from '../CentralProgress';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {copyTextToClipboard, Logger} from '@selfcommunity/utils';
import {useSnackbar} from 'notistack';
import {getContributionRouteName, getRouteData} from '../../utils/contribution';
import classNames from 'classnames';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import {
  Badge,
  Box,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  Divider,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  SwipeableDrawer,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  MODERATION_CONTRIBUTION_STATE_DELETED,
  MODERATION_CONTRIBUTION_STATE_HIDDEN,
  MODERATION_TYPE_ACTION_DELETE,
  MODERATION_TYPE_ACTION_HIDE,
  REPORT_AGGRESSIVE,
  REPORT_OFFTOPIC,
  REPORT_POORCONTENT,
  REPORT_SPAM,
  REPORT_VULGAR,
  REPORTS
} from '../../constants/Flagging';
import {Endpoints, http, HttpResponse} from '@selfcommunity/api-services';
import {
  SCContext,
  SCContextType,
  SCRoutingContextType,
  SCThemeType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCFetchCommentObject,
  useSCFetchFeedObject,
  useSCRouting
} from '@selfcommunity/react-core';
import {SCCommentType, SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {
  DELETE_CONTRIBUTION,
  DELETE_CONTRIBUTION_SECTION,
  EDIT_CONTRIBUTION,
  FLAG_CONTRIBUTION_SECTION,
  GENERAL_SECTION,
  GET_CONTRIBUTION_PERMALINK,
  HIDE_CONTRIBUTION_SECTION,
  MODERATE_CONTRIBUTION_DELETED,
  MODERATE_CONTRIBUTION_HIDDEN,
  RESTORE_CONTRIBUTION,
  SUSPEND_NOTIFICATION_CONTRIBUTION
} from '../../constants/ContributionsActionsMenu';

const PREFIX = 'SCContributionActionsMenu';

const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`,
  popper: `${PREFIX}-popper`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`,
  itemText: `${PREFIX}-item-text`,
  subItem: `${PREFIX}-sub-item`,
  subItemText: `${PREFIX}-sub-item-text`,
  footerSubItems: `${PREFIX}-footer-sub-items`,
  selectedIcon: `${PREFIX}-selected-icon`,
  sectionBadge: `${PREFIX}-section-badge`,
  sectionWithSelectionIcon: `${PREFIX}-section-with-selection-icon`,
  visibilityBadge: `${PREFIX}-visibility-badge`
};

const PopperRoot = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  zIndex: 2,
  [`&.${classes.popper}`]: {
    overflow: 'visible',
    filter: 'drop-shadow(0px -1px 5px rgba(0,0,0,0.10))',
    mt: 1.5
  },
  [`& .${classes.paper}`]: {
    width: 280
  },
  [`& .${classes.footerSubItems}`]: {
    margin: '10px 10px 10px 17px',
    border: '1px solid #dddddd',
    padding: 5,
    borderRadius: 3,
    fontSize: 11
  },
  [`& .${classes.selectedIcon}`]: {
    marginLeft: 2,
    '&.MuiListItemIcon-root': {
      width: '10px'
    },
    '& svg': {
      fontSize: '1.4rem'
    }
  },
  [`& .${classes.sectionBadge}`]: {
    padding: 0,
    minWidth: 15,
    height: 15,
    top: 3
  },
  [`& .${classes.sectionWithSelectionIcon}`]: {
    fontSize: 12,
    color: '#FFF'
  }
}));

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  [`& .${classes.visibilityBadge}`]: {
    color: 'red',
    '& > span': {
      padding: 12,
      fontSize: 15
    }
  }
}));

const messages = defineMessages({
  title: {
    id: 'ui.contributionActionMenu.title',
    defaultMessage: 'ui.contributionActionMenu.title'
  },
  spam: {
    id: 'ui.contributionActionMenu.spam',
    defaultMessage: 'ui.contributionActionMenu.spam'
  },
  aggressive: {
    id: 'ui.contributionActionMenu.aggressive',
    defaultMessage: 'ui.contributionActionMenu.aggressive'
  },
  vulgar: {
    id: 'ui.contributionActionMenu.vulgar',
    defaultMessage: 'ui.contributionActionMenu.vulgar'
  },
  poorContent: {
    id: 'ui.contributionActionMenu.poorContent',
    defaultMessage: 'ui.contributionActionMenu.poorContent'
  },
  offtopic: {
    id: 'ui.contributionActionMenu.offtopic',
    defaultMessage: 'ui.contributionActionMenu.offtopic'
  },
  footer: {
    id: 'ui.contributionActionMenu.footer',
    defaultMessage: 'ui.contributionActionMenu.footer'
  }
});

export interface ContributionActionsMenuProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * FeedObject id
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed obj
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed obj type
   * @default 'post'
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * CommentObject id
   * @default null
   */
  commentObjectId?: number;

  /**
   * Comment obj
   * @default null
   */
  commentObject?: SCCommentType;

  /**
   * Handle edit obj
   */
  onEditContribution?: (obj: SCCommentType | SCFeedObjectType) => void;

  /**
   * Handle hide obj
   */
  onHideContribution?: (obj: SCCommentType | SCFeedObjectType) => void;

  /**
   * Handle delete obj
   */
  onDeleteContribution?: (obj: SCCommentType | SCFeedObjectType) => void;

  /**
   * Handle restore obj
   */
  onRestoreContribution?: (obj: SCCommentType | SCFeedObjectType) => void;

  /**
   * Handle suspend notification obj
   */
  onSuspendNotificationContribution?: (obj: SCCommentType | SCFeedObjectType) => void;

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

export default function ContributionActionsMenu(props: ContributionActionsMenuProps): JSX.Element {
  // PROPS
  const {
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCContributionType.POST,
    commentObjectId,
    commentObject,
    onEditContribution,
    onHideContribution,
    onDeleteContribution,
    onRestoreContribution,
    onSuspendNotificationContribution,
    PopperProps = {},
    ...rest
  } = props;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scContext: SCContextType = useContext(SCContext);
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scUserId = scUserContext.user ? scUserContext.user.id : null;
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {enqueueSnackbar} = useSnackbar();

  // CONTRIBUTION STATE
  const {obj: feedObj, setObj: setFeedObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const {obj: commentObj, setObj: setCommentObj} = useSCFetchCommentObject({id: commentObjectId, commentObject});

  // GENERAL POPPER STATE
  const [open, setOpen] = useState<boolean>(false);
  const [openSection, setOpenSection] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // MODERATION FLAGS STATE
  const [flagType, setFlagType] = useState<number>(null);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);

  // MODERATION HIDE STATE
  const [hideType, setHideType] = useState<string>(null);
  const [hideFlagType, setHideFlagType] = useState<string>(null);

  // MODERATION DELETE STATE
  const [deleteType, setDeleteType] = useState<string>(null);
  const [deleteFlagType, setDeleteFlagType] = useState<string>(null);

  // CONFIRM ACTION DIALOG STATE
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<string>(null);
  const [currentActionLoading, setCurrentActionLoading] = useState<string>(null);

  // CONST
  const contributionObj: SCFeedObjectType | SCCommentType = commentObj ? commentObj : feedObj;
  let popperRef = useRef(null);

  /**
   * Intial extra sections to render, in addition to the GENERAL_SECTION
   * @return {array}
   */
  const getExtraSections = useMemo(
    () => () => {
      let _extra = [];
      if (
        scUserContext.user &&
        Boolean(contributionObj) &&
        scUserId !== contributionObj.author.id &&
        !contributionObj.deleted &&
        !contributionObj.collapsed
      ) {
        _extra.push(FLAG_CONTRIBUTION_SECTION);
      }
      // Enable when backend is ready
      if (UserUtils.isStaff(scUserContext.user)) {
        // admin or moderator
        _extra.push(HIDE_CONTRIBUTION_SECTION);
        _extra.push(DELETE_CONTRIBUTION_SECTION);
      }
      return _extra;
    },
    [contributionObj, scUserId]
  );

  /**
   * Extra sections to render in the popup
   */
  const extraSections = getExtraSections();

  /**
   * Define renders for extra section
   */
  const extraSectionsRenders = {
    [FLAG_CONTRIBUTION_SECTION]: renderFlagContributionSection,
    [HIDE_CONTRIBUTION_SECTION]: renderHideContributionSection,
    [DELETE_CONTRIBUTION_SECTION]: renderDeleteContributionSection
  };

  /**
   * Handles open popup
   */
  function handleOpen() {
    if (scUserContext.user) {
      setIsLoading(true);
      Promise.all([fetchFlagStatus(), fetchModerationStatus()]).then(() => {
        setIsLoading(false);
      });
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
   * Performs  notification suspension
   */
  const performSuspendNotification = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.UserSuspendContributionNotification.url({type: contributionObj.type, id: contributionObj.id}),
          method: Endpoints.UserSuspendContributionNotification.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [contributionObj]
  );

  /**
   * Handles stop notification for contributionObj
   * @param contribution
   */
  function handleSuspendContentNotification() {
    setCurrentActionLoading(SUSPEND_NOTIFICATION_CONTRIBUTION);
    performSuspendNotification()
      .then((data) => {
        const _feedObj = Object.assign({}, feedObj, {suspended: !feedObj.suspended});
        setFeedObj(_feedObj);
        onSuspendNotificationContribution && onSuspendNotificationContribution(_feedObj);
        setCurrentActionLoading(null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        setCurrentAction(null);
        setCurrentActionLoading(null);
        enqueueSnackbar(<FormattedMessage id="ui.contributionActionMenu.actionError" defaultMessage="ui.contributionActionMenu.actionError" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }

  /**
   * Get Status Flag
   */
  const performFetchFlagStatus = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.FlagStatus.url({type: contributionObj.type, id: contributionObj.id}),
          method: Endpoints.FlagStatus.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [contributionObj]
  );

  /**
   * Perform Flag
   */
  const performFlag = useMemo(
    () => (type) => {
      return http
        .request({
          url: Endpoints.Flag.url({type: contributionObj.type, id: contributionObj.id}),
          method: Endpoints.Flag.method,
          data: {flag_type: type}
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [contributionObj]
  );

  /**
   * Get Status Flag
   */
  const performFetchModerationStatus = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.ModerateContributionStatus.url({contribution_type: contributionObj.type, id: contributionObj.id}),
          method: Endpoints.ModerateContributionStatus.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [contributionObj]
  );

  /**
   * Perform delete contribution
   */
  const performDeleteContribution = useMemo(
    () => () => {
      const contributionType: string = contributionObj.type;
      return http
        .request({
          url:
            contributionType === SCContributionType.COMMENT
              ? Endpoints.DeleteComment.url({id: contributionObj.id})
              : Endpoints.DeleteFeedObject.url({type: contributionType, id: contributionObj.id}),
          method: contributionType === SCContributionType.COMMENT ? Endpoints.DeleteComment.method : Endpoints.DeleteFeedObject.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [contributionObj]
  );

  /**
   * Perform restore contribution
   */
  const performRestoreContribution = useMemo(
    () => () => {
      const contributionType: string = contributionObj.type;
      return http
        .request({
          url:
            contributionType === SCContributionType.COMMENT
              ? Endpoints.RestoreComment.url({id: contributionObj.id})
              : Endpoints.RestoreFeedObject.url({type: contributionType, id: contributionObj.id}),
          method: contributionType === SCContributionType.COMMENT ? Endpoints.RestoreComment.method : Endpoints.RestoreFeedObject.method
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [contributionObj]
  );

  /**
   * Fetch initial flag status
   */
  function fetchFlagStatus() {
    if (contributionObj && extraSections.includes(FLAG_CONTRIBUTION_SECTION)) {
      return performFetchFlagStatus()
        .then((data) => {
          // It could also be spam (=0)
          if (data['flag_type'] !== undefined && data['flag_type'] !== null) {
            setFlagType(data['flag_type']);
          }
        })
        .catch((error) => {
          console.dir(error);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
    return Promise.resolve();
  }

  /**
   * Fetch initial moderation status
   */
  function fetchModerationStatus() {
    if (contributionObj && (extraSections.includes(HIDE_CONTRIBUTION_SECTION) || extraSections.includes(DELETE_CONTRIBUTION_SECTION))) {
      return performFetchModerationStatus()
        .then((data) => {
          // It could also be spam (=0)
          if (data['flag_type'] !== undefined && data['flag_type'] !== null) {
            if (data.status === MODERATION_CONTRIBUTION_STATE_DELETED) {
              setDeleteType(data['flag_type']);
            } else if (data.status === MODERATION_CONTRIBUTION_STATE_HIDDEN) {
              setHideType(data['flag_type']);
            }
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
    return Promise.resolve();
  }

  /**
   * Perform contribute flagging by authenticated user
   * If the user authenticated is blocked, deny this action
   * @param type
   */
  function handleFlagContribution(type) {
    if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else if (contributionObj && !isLoading && !isFlagging && type !== 'undefined') {
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
   * Perform moderation
   */
  const performModerationContribution = useMemo(
    () => (action, type) => {
      return http
        .request({
          url: Endpoints.ModerateContribution.url({id: contributionObj.id}),
          method: Endpoints.ModerateContribution.method,
          data: {contribution_type: contributionObj.type, ...(type !== null ? {moderation_type: type} : {}), action: action}
        })
        .then((res: HttpResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [contributionObj]
  );

  /**
   * Perform contribute moderation hide
   * @param type
   */
  function handleHideContribution(type) {
    setHideFlagType(type);
    handleAction(MODERATE_CONTRIBUTION_HIDDEN);
  }

  /**
   * Perform contribute moderation delete
   * @param type
   */
  function handleDeleteContribution(type) {
    setDeleteFlagType(type);
    handleAction(MODERATE_CONTRIBUTION_DELETED);
  }

  /**
   * handle action
   */
  function handleAction(action) {
    if (
      UserUtils.isBlocked(scUserContext.user) &&
      [EDIT_CONTRIBUTION, MODERATE_CONTRIBUTION_HIDDEN, MODERATE_CONTRIBUTION_DELETED].includes(action)
    ) {
      // if user is blocked, deny edit and moderate
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
      return;
    }
    if (action === GET_CONTRIBUTION_PERMALINK) {
      copyTextToClipboard(
        `${location.protocol}//${location.host}${scRoutingContext.url(getContributionRouteName(contributionObj), getRouteData(contributionObj))}`
      ).then(() => {
        setOpen(false);
        enqueueSnackbar(<FormattedMessage id="ui.common.permanentLinkCopied" defaultMessage="ui.common.permanentLinkCopied" />, {
          variant: 'success',
          autoHideDuration: 3000
        });
      });
      handleClose();
    } else if (action === EDIT_CONTRIBUTION) {
      onEditContribution && onEditContribution(contributionObj);
      handleClose();
    } else if (action === DELETE_CONTRIBUTION) {
      setCurrentAction(DELETE_CONTRIBUTION);
      setOpenConfirmDialog(true);
      handleClose();
    } else if (action === RESTORE_CONTRIBUTION) {
      setCurrentAction(RESTORE_CONTRIBUTION);
      setOpenConfirmDialog(true);
      handleClose();
    } else if (action === SUSPEND_NOTIFICATION_CONTRIBUTION) {
      setCurrentAction(SUSPEND_NOTIFICATION_CONTRIBUTION);
      handleSuspendContentNotification();
    } else if (action === MODERATE_CONTRIBUTION_HIDDEN) {
      setCurrentAction(MODERATE_CONTRIBUTION_HIDDEN);
      setOpenConfirmDialog(true);
      handleClose();
    } else if (action === MODERATE_CONTRIBUTION_DELETED) {
      setCurrentAction(MODERATE_CONTRIBUTION_DELETED);
      setOpenConfirmDialog(true);
      handleClose();
    }
  }

  /**
   * Perform additional operations at the end of single action
   */
  function performPostConfirmAction(success) {
    if (success) {
      if ([DELETE_CONTRIBUTION, RESTORE_CONTRIBUTION].includes(currentAction)) {
        commentObj
          ? setCommentObj({...commentObj, ...{deleted: currentAction === DELETE_CONTRIBUTION}})
          : setFeedObj({...feedObj, ...{deleted: currentAction === DELETE_CONTRIBUTION}});
      } else if (currentAction === MODERATE_CONTRIBUTION_HIDDEN) {
        commentObj
          ? setCommentObj({...commentObj, ...{collapsed: !commentObj.collapsed}})
          : setFeedObj({...feedObj, ...{collapsed: !feedObj.collapsed}});
      } else if (currentAction === MODERATE_CONTRIBUTION_DELETED) {
        commentObj ? setCommentObj({...commentObj, ...{deleted: !commentObj.deleted}}) : setFeedObj({...feedObj, ...{deleted: !feedObj.deleted}});
      }
      setCurrentActionLoading(null);
      setCurrentAction(null);
      setOpenConfirmDialog(false);
      enqueueSnackbar(<FormattedMessage id="ui.contributionActionMenu.actionSuccess" defaultMessage="ui.contributionActionMenu.actionSuccess" />, {
        variant: 'success',
        autoHideDuration: 3000
      });
    } else {
      setCurrentActionLoading(null);
      enqueueSnackbar(<FormattedMessage id="ui.contributionActionMenu.actionError" defaultMessage="ui.contributionActionMenu.actionError" />, {
        variant: 'error',
        autoHideDuration: 3000
      });
    }
  }

  /**
   * Delete a contribution
   */
  function handleConfirmedAction() {
    if (contributionObj && !isLoading && !currentActionLoading) {
      if (currentAction === DELETE_CONTRIBUTION) {
        setCurrentActionLoading(RESTORE_CONTRIBUTION);
        performDeleteContribution()
          .then((data) => {
            setFeedObj(Object.assign({}, feedObj, {deleted: true}));
            onDeleteContribution && onDeleteContribution(contributionObj);
            performPostConfirmAction(true);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            performPostConfirmAction(false);
          });
      } else if (currentAction === RESTORE_CONTRIBUTION) {
        setCurrentActionLoading(RESTORE_CONTRIBUTION);
        performRestoreContribution()
          .then((data) => {
            setFeedObj(Object.assign({}, feedObj, {deleted: false}));
            onRestoreContribution && onRestoreContribution(contributionObj);
            performPostConfirmAction(true);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            performPostConfirmAction(false);
          });
      } else if (currentAction === MODERATE_CONTRIBUTION_HIDDEN) {
        setCurrentActionLoading(MODERATE_CONTRIBUTION_HIDDEN);
        performModerationContribution(MODERATION_TYPE_ACTION_HIDE, hideFlagType)
          .then((data) => {
            setHideType(hideType === hideFlagType ? null : hideFlagType);
            setHideFlagType(null);
            setFeedObj(Object.assign({}, feedObj, {collapsed: !feedObj.collapsed}));
            onHideContribution && onHideContribution(contributionObj);
            performPostConfirmAction(true);
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
            performPostConfirmAction(false);
          });
      } else if (currentAction === MODERATE_CONTRIBUTION_DELETED) {
        setCurrentActionLoading(MODERATE_CONTRIBUTION_DELETED);
        performModerationContribution(MODERATION_TYPE_ACTION_DELETE, deleteFlagType)
          .then((data) => {
            setDeleteType(deleteType === deleteFlagType ? null : deleteFlagType);
            setDeleteFlagType(null);
            setFeedObj(Object.assign({}, feedObj, {deleted: !feedObj.deleted}));
            onDeleteContribution && onDeleteContribution(contributionObj);
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
   * Returns flag label based on type
   * @param flagType
   * @return {*}
   */
  function getReportName(flagType) {
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
   * action
   * @param actionId
   */
  function handleOpenSection(sectionId) {
    if (sectionId) {
      if (sectionId === openSection) {
        setOpenSection(null);
      } else {
        setOpenSection(sectionId);
      }
    } else {
      setOpenSection(null);
    }
  }

  /**
   * Renders single flag item
   * @return {[{REPORTS}]}
   */
  function renderReports(section) {
    const handlerFunc =
      section === FLAG_CONTRIBUTION_SECTION
        ? handleFlagContribution
        : section === HIDE_CONTRIBUTION_SECTION
        ? handleHideContribution
        : handleDeleteContribution;
    let value = FLAG_CONTRIBUTION_SECTION ? flagType : section === HIDE_CONTRIBUTION_SECTION ? hideType : deleteType;
    return REPORTS.map((report, index) => {
      return (
        <MenuItem key={`${section}_${index}`} className={classes.subItem} disabled={isFlagging}>
          <ListItemIcon classes={{root: classes.selectedIcon}}>{value === report && <Icon color="secondary">check</Icon>}</ListItemIcon>
          <ListItemText primary={getReportName(report)} onClick={() => handlerFunc(report)} classes={{root: classes.subItemText}} />
        </MenuItem>
      );
    });
  }

  /**
   * Renders section flags actions
   */
  function renderFlagContributionSection() {
    const open = openSection === FLAG_CONTRIBUTION_SECTION;
    return (
      <Box>
        {!contributionObj.deleted && !contributionObj.collapsed && (
          <Box>
            <MenuItem className={classes.subItem} disabled={isFlagging} onClick={() => handleOpenSection(FLAG_CONTRIBUTION_SECTION)}>
              <ListItemIcon>
                {flagType !== undefined && flagType !== null ? (
                  <Badge
                    classes={{badge: classes.sectionBadge}}
                    badgeContent={<Icon className={classes.sectionWithSelectionIcon}>check</Icon>}
                    color="primary">
                    <Icon>outlined_flag</Icon>
                  </Badge>
                ) : (
                  <Icon>outlined_flag</Icon>
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <FormattedMessage
                    id="ui.contributionActionMenu.flagContributionWithMotivation"
                    defaultMessage="ui.contributionActionMenu.flagContributionWithMotivation"
                  />
                }
              />
              {open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </MenuItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {renderReports(FLAG_CONTRIBUTION_SECTION)}
              <Typography variant={'caption'} component={'div'} className={classes.footerSubItems}>
                {intl.formatMessage(messages.footer)}
              </Typography>
            </Collapse>
          </Box>
        )}
      </Box>
    );
  }

  /**
   * Renders section hide actions
   */
  function renderHideContributionSection() {
    const open = openSection === HIDE_CONTRIBUTION_SECTION;
    return (
      <Box key={HIDE_CONTRIBUTION_SECTION}>
        {!contributionObj.deleted && (
          <Box>
            {hideType !== undefined && hideType !== null ? (
              <>
                <MenuItem className={classes.subItem} disabled={Boolean(currentAction)} onClick={() => handleAction(MODERATE_CONTRIBUTION_HIDDEN)}>
                  <ListItemIcon>
                    <Icon>restore</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <>
                        <FormattedMessage
                          id="ui.contributionActionMenu.restoreFromHidden"
                          defaultMessage="ui.contributionActionMenu.restoreFromHidden"
                        />{' '}
                        ({getReportName(hideType)})
                      </>
                    }
                  />
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem className={classes.subItem} disabled={Boolean(currentAction)} onClick={() => handleOpenSection(HIDE_CONTRIBUTION_SECTION)}>
                  <ListItemIcon>
                    <Icon>hide_image</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="ui.contributionActionMenu.hideContributionWithMotivation"
                        defaultMessage="ui.contributionActionMenu.hideContributionWithMotivation"
                      />
                    }
                  />
                  {open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
                </MenuItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  {renderReports(HIDE_CONTRIBUTION_SECTION)}
                </Collapse>
              </>
            )}
          </Box>
        )}
      </Box>
    );
  }

  /**
   * Renders section hidden actions
   */
  function renderDeleteContributionSection() {
    const open = openSection === DELETE_CONTRIBUTION_SECTION;
    return (
      <Box key={DELETE_CONTRIBUTION_SECTION}>
        {!contributionObj.collapsed && !(contributionObj.deleted && !deleteType) && (
          <Box>
            {deleteType !== undefined && deleteType !== null ? (
              <>
                <MenuItem className={classes.subItem} disabled={Boolean(currentAction)} onClick={() => handleAction(MODERATE_CONTRIBUTION_DELETED)}>
                  <ListItemIcon>
                    <Icon>restore_from_trash</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <>
                        <FormattedMessage
                          id="ui.contributionActionMenu.restoreFromDeleted"
                          defaultMessage="ui.contributionActionMenu.restoreFromDeleted"
                        />{' '}
                        ({getReportName(deleteType)})
                      </>
                    }
                  />
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  className={classes.subItem}
                  disabled={Boolean(currentAction)}
                  onClick={() => handleOpenSection(DELETE_CONTRIBUTION_SECTION)}>
                  <ListItemIcon>
                    <Icon>delete</Icon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <FormattedMessage
                        id="ui.contributionActionMenu.deleteContributionWithMotivation"
                        defaultMessage="ui.contributionActionMenu.deleteContributionWithMotivation"
                      />
                    }
                  />
                  {open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
                </MenuItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  {renderReports(DELETE_CONTRIBUTION_SECTION)}
                </Collapse>
              </>
            )}
          </Box>
        )}
      </Box>
    );
  }

  /**
   * Can authenticated user modify the contribution
   */
  function canModifyContribution(): boolean {
    return scUserContext.user && scUserContext.user.id === contributionObj.author.id && !contributionObj.deleted;
  }

  /**
   * Can authenticated user delete the contribution
   */
  function canDeleteContribution(): boolean {
    return scUserContext.user && scUserContext.user.id === contributionObj.author.id && !deleteType;
  }

  /**
   * Can authenticated user suspend notification for the contribution
   */
  function canSuspendNotificationContribution(): boolean {
    return (
      scUserContext.user &&
      scUserContext.user.id !== contributionObj.author.id &&
      contributionObj &&
      contributionObj.type !== SCContributionType.COMMENT
    );
  }

  /**
   * Renders section general
   */
  function renderGeneralSection() {
    return (
      <Box key={GENERAL_SECTION}>
        <MenuItem className={classes.subItem} disabled={isFlagging}>
          <ListItemIcon>
            <Icon>link</Icon>
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage id="ui.contributionActionMenu.permanentLink" defaultMessage="ui.contributionActionMenu.permanentLink" />}
            onClick={() => handleAction(GET_CONTRIBUTION_PERMALINK)}
            classes={{root: classes.itemText}}
          />
        </MenuItem>
        {canModifyContribution() && (
          <MenuItem className={classes.subItem} disabled={isFlagging}>
            <ListItemIcon>
              <Icon>edit</Icon>
            </ListItemIcon>
            <ListItemText
              primary={
                <FormattedMessage id="ui.contributionActionMenu.editContribution" defaultMessage="ui.contributionActionMenu.editContribution" />
              }
              onClick={() => handleAction(EDIT_CONTRIBUTION)}
              classes={{root: classes.itemText}}
            />
          </MenuItem>
        )}
        {canDeleteContribution() && (
          <MenuItem className={classes.subItem} disabled={isFlagging}>
            <ListItemIcon>
              {currentActionLoading === DELETE_CONTRIBUTION || currentActionLoading === RESTORE_CONTRIBUTION ? (
                <CircularProgress size={20} />
              ) : (
                <Icon>delete</Icon>
              )}
            </ListItemIcon>
            {contributionObj.deleted ? (
              <ListItemText
                primary={
                  <FormattedMessage
                    id="ui.contributionActionMenu.restoreContribution"
                    defaultMessage="ui.contributionActionMenu.restoreContribution"
                  />
                }
                onClick={() => handleAction(RESTORE_CONTRIBUTION)}
                classes={{root: classes.itemText}}
              />
            ) : (
              <ListItemText
                primary={
                  <FormattedMessage id="ui.contributionActionMenu.deleteContribution" defaultMessage="ui.contributionActionMenu.deleteContribution" />
                }
                onClick={() => handleAction(DELETE_CONTRIBUTION)}
                classes={{root: classes.itemText}}
              />
            )}
          </MenuItem>
        )}
        {canSuspendNotificationContribution() && (
          <MenuItem className={classes.subItem} disabled={isFlagging}>
            <ListItemIcon>
              {currentActionLoading === SUSPEND_NOTIFICATION_CONTRIBUTION ? (
                <CircularProgress size={20} />
              ) : contributionObj['suspended'] ? (
                <Icon>notifications_active</Icon>
              ) : (
                <Icon>notifications_off</Icon>
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                contributionObj['suspended'] ? (
                  <FormattedMessage
                    id="ui.contributionActionMenu.enableNotificationContribution"
                    defaultMessage="ui.contributionActionMenu.enableNotificationContribution"
                  />
                ) : (
                  <FormattedMessage
                    id="ui.contributionActionMenu.suspendNotificationContribution"
                    defaultMessage="ui.contributionActionMenu.suspendNotificationContribution"
                  />
                )
              }
              onClick={() => handleAction(SUSPEND_NOTIFICATION_CONTRIBUTION)}
              classes={{root: classes.itemText}}
            />
          </MenuItem>
        )}
      </Box>
    );
  }

  /**
   * Renders contribution menu content
   */
  function renderContent() {
    return (
      <Box>
        {isLoading || (!feedObj && !commentObj) ? (
          <CentralProgress size={30} />
        ) : (
          <MenuList>
            {renderGeneralSection()}
            {Boolean(extraSections.length) && <Divider />}
            {extraSections.map((s, i) => (
              <Box key={`es_${i}`}>{extraSectionsRenders[s]()}</Box>
            ))}
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
        ref={(ref) => {
          popperRef.current = ref;
        }}
        aria-haspopup="true"
        onClick={handleOpen}
        className={classes.button}
        size="small">
        {contributionObj && (contributionObj.collapsed || contributionObj.deleted) ? (
          <Badge
            badgeContent={contributionObj.collapsed ? <Icon>visibility_off</Icon> : <Icon>delete</Icon>}
            classes={{badge: classes.visibilityBadge}}>
            <Icon>more_vert</Icon>
          </Badge>
        ) : (
          <Icon>more_vert</Icon>
        )}
      </IconButton>
      {isMobile ? (
        <SwipeableDrawer open={open} onClose={handleClose} onOpen={handleOpen} anchor="bottom" disableSwipeToOpen>
          {renderContent()}
        </SwipeableDrawer>
      ) : (
        <PopperRoot
          open={open}
          anchorEl={popperRef.current}
          role={undefined}
          transition
          className={classes.popper}
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
