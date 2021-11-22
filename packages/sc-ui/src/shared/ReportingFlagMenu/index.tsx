import React, {useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {defineMessages, useIntl} from 'react-intl';
import Popper from '@mui/material/Popper';
import {Endpoints, http, Logger, SCFeedObjectType, SCFeedObjectTypologyType, useSCFetchFeedObject} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../constants/Errors';
import SelectedIcon from '@mui/icons-material/CheckCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {ClickAwayListener, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography} from '@mui/material';

import {REPORT_AGGRESSIVE, REPORT_OFFTOPIC, REPORT_POORCONTENT, REPORT_SPAM, REPORT_VULGAR, REPORTS} from '../../constants/Flagging';
import CentralProgress from '../CentralProgress';

const PREFIX = 'SCFeedObjectReportMenu';

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
    maxWidth: 260,
    padding: '10px 20px'
  },

  [`& .${classes.footer}`]: {
    marginTop: 10
  },

  [`& .${classes.item}`]: {
    borderBottom: '1px solid #e5e5e5'
  },

  [`& .${classes.itemText}`]: {
    marginLeft: 7
  },

  [`& .${classes.selectedIcon}`]: {
    marginLeft: -17,
    minWidth: 25,
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

export default function ReportingFlagMenu({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  [p: string]: any;
}): JSX.Element {
  const intl = useIntl();
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const [flagType, setFlagType] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  let popperRef = useRef(null);

  /**
   * Get Status Flag
   */
  const performFlagStatus = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.FlagStatus.url({type: feedObjectType, id: obj.id}),
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
    () => () => {
      return http
        .request({
          url: Endpoints.Flag.url({type: feedObjectType, id: obj.id}),
          method: Endpoints.Flag.method
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
      performFlagStatus()
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
      performFlag()
        .then((data) => {
          setFlagType(type);
          setIsFlagging(false);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Handle open flagging popup, retrive always the flag status (if exist)
   */
  function handleOpen() {
    setOpen(true);
    fetchFlagStatus();
  }

  /**
   * Close the flagging popup
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
        onClick={handleOpen}
        className={classes.button}
        size="medium">
        <MoreVertIcon />
      </IconButton>
      <Root open={open} anchorEl={popperRef.current} role={undefined} transition className={classes.popper} placement="bottom-start">
        {({TransitionProps, placement}) => (
          <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
            <Paper variant={'outlined'} className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                {isLoading ? (
                  <CentralProgress size={30} />
                ) : (
                  <MenuList>
                    <Typography variant={'body1'} gutterBottom>
                      {intl.formatMessage(messages.title)}
                    </Typography>
                    {renderFlags()}
                    <Typography variant={'caption'} className={classes.footer}>
                      {intl.formatMessage(messages.footer)}
                    </Typography>
                  </MenuList>
                )}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Root>
    </React.Fragment>
  );
}
