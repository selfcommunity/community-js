import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCSubscribedEventsManagerType,
  SCThemeType,
  SCUserContextType,
  useSCContext,
  useSCFetchEvent,
  useSCUser
} from '@selfcommunity/react-core';
import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType, SCUserType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {Box, Button, Checkbox, Icon, Menu, MenuItem, SwipeableDrawer, useMediaQuery, useTheme} from '@mui/material';
import {LoadingButton} from '@mui/lab';

const PREFIX = 'SCEventSubscribeButton';

const classes = {
  requestRoot: `${PREFIX}-request-root`,
  selectRoot: `${PREFIX}-select-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`,
  going: `${PREFIX}-going`,
  notGoing: `${PREFIX}-not-going`
};

const options = [
  {
    value: SCEventSubscriptionStatusType.GOING,
    label: <FormattedMessage id="ui.eventSubscribeButton.going" defaultMessage="ui.eventSubscribeButton.going" />
  },
  {
    value: SCEventSubscriptionStatusType.NOT_GOING,
    label: <FormattedMessage id="ui.eventSubscribeButton.notGoing" defaultMessage="ui.eventSubscribeButton.notGoing" />
  }
];

const RequestRoot = styled(LoadingButton, {
  name: PREFIX,
  slot: 'RequestRoot'
})(() => ({}));

const SelectRoot = styled(Button, {
  name: PREFIX,
  slot: 'SelectRoot'
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'DrawerRoot'
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'MenuRoot'
})(() => ({}));

export interface EventSubscribeButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Event Object
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of the event
   * @default null
   */
  eventId?: number;

  /**
   * The user to be accepted into the event
   * @default null
   */
  user?: SCUserType;

  /**
   * onSubscribe callback
   * @param user
   * @param joined
   */
  onSubscribe?: (event: SCEventType, status: string | null) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Event Subscribe Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventSubscribeButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEventSubscribeButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventSubscribeButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function EventSubscribeButton(inProps: EventSubscribeButtonProps): JSX.Element {
  // PROPS
  const props: EventSubscribeButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, eventId, event, user, onSubscribe, ...rest} = props;

  // STATE
  const [status, setStatus] = useState<string>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scEventsManager: SCSubscribedEventsManagerType = scUserContext.managers.events;
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  const {scEvent} = useSCFetchEvent({
    id: eventId,
    event,
    cacheStrategy: authUserId ? CacheStrategies.CACHE_FIRST : CacheStrategies.STALE_WHILE_REVALIDATE
  });

  const isEventAdmin = useMemo(
    () => scUserContext.user && scEvent?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scEvent?.managed_by?.id]
  );

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    /**
     * Call scEventsManager.subscriptionStatus inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setStatus(scEventsManager?.subscriptionStatus(scEvent));
    }
  }, [authUserId, scEventsManager?.subscriptionStatus, scEvent]);

  const toggleGoingToEvent = (user?: SCUserType) => {
    scEventsManager
      .toggleEventAttendance(scEvent, user?.id)
      .then(() => {
        const _status =
          scEvent.privacy === SCEventPrivacyType.PRIVATE && scEvent.subscription_status !== SCEventSubscriptionStatusType.INVITED
            ? SCEventSubscriptionStatusType.REQUESTED
            : scEvent.subscription_status === SCEventSubscriptionStatusType.GOING
            ? SCEventSubscriptionStatusType.SUBSCRIBED
            : SCEventSubscriptionStatusType.GOING;
        onSubscribe && onSubscribe(scEvent, _status);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const toggleNotGoingToEvent = () => {
    scEventsManager
      .toggleEventNonattendance(scEvent)
      .then(() => {
        const _status =
          scEvent.subscription_status === SCEventSubscriptionStatusType.NOT_GOING
            ? SCEventSubscriptionStatusType.SUBSCRIBED
            : SCEventSubscriptionStatusType.NOT_GOING;
        onSubscribe && onSubscribe(scEvent, _status);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleToggleAction = (event) => {
    const _status = event.target.value;
    setAnchorEl(null);
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      (_status === SCEventSubscriptionStatusType.NOT_GOING && !user?.id) || (!_status && user?.id) ? toggleNotGoingToEvent() : toggleGoingToEvent();
    }
  };

  function renderMenuItems() {
    return (
      <Box>
        {options.map((option) => (
          <MenuItem key={option.value} className={classes.item}>
            {option.label}
            <Checkbox
              size="small"
              checked={status === option.value}
              value={option.value}
              onChange={handleToggleAction}
              name={`${option.value}-option`}
              inputProps={{'aria-label': `${option.label}`}}
            />
          </MenuItem>
        ))}
      </Box>
    );
  }

  /**
   * Get current translated status
   */
  const getStatus = useMemo((): JSX.Element => {
    let _status;
    switch (status) {
      case SCEventSubscriptionStatusType.REQUESTED:
        _status = <FormattedMessage defaultMessage="ui.eventSubscribeButton.waitingApproval" id="ui.eventSubscribeButton.waitingApproval" />;
        break;
      case SCEventSubscriptionStatusType.GOING:
        _status = <FormattedMessage defaultMessage="ui.eventSubscribeButton.going" id="ui.eventSubscribeButton.going" />;
        break;
      case SCEventSubscriptionStatusType.INVITED:
        _status = <FormattedMessage defaultMessage="ui.eventSubscribeButton.accept" id="ui.eventSubscribeButton.accept" />;
        break;
      case SCEventSubscriptionStatusType.NOT_GOING:
        _status = <FormattedMessage defaultMessage="ui.eventSubscribeButton.notGoing" id="ui.eventSubscribeButton.notGoing" />;
        break;
      default:
        scEvent?.privacy === SCEventPrivacyType.PUBLIC
          ? (_status = <FormattedMessage defaultMessage="ui.eventSubscribeButton.label" id="ui.eventSubscribeButton.label" />)
          : (_status = (
              <FormattedMessage defaultMessage="ui.eventSubscribeButton.requestParticipation" id="ui.eventSubscribeButton.requestParticipation" />
            ));
        break;
    }
    return _status;
  }, [status, scEvent]);

  if (!scEvent || (isEventAdmin && user?.id === scUserContext.user.id) || (isEventAdmin && !user?.id)) {
    return null;
  }

  return (
    <>
      {scEvent?.privacy !== SCEventPrivacyType.PRIVATE ? (
        <>
          <SelectRoot
            className={classNames(
              classes.selectRoot,
              className,
              {[classes.going]: status && status === SCEventSubscriptionStatusType.GOING},
              {[classes.notGoing]: status && status === SCEventSubscriptionStatusType.NOT_GOING}
            )}
            onClick={handleOpen}
            endIcon={<Icon>{open ? 'expand_less' : 'expand_more'}</Icon>}
            startIcon={
              status &&
              status !== SCEventSubscriptionStatusType.SUBSCRIBED && (
                <Icon>{status === SCEventSubscriptionStatusType.GOING ? 'circle_checked' : 'circle_closed'}</Icon>
              )
            }
            {...rest}>
            {getStatus}
          </SelectRoot>
          {isMobile ? (
            <SwipeableDrawerRoot
              className={classes.drawerRoot}
              PaperProps={{className: classes.paper}}
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              anchor="bottom"
              disableSwipeToOpen>
              {renderMenuItems()}
            </SwipeableDrawerRoot>
          ) : (
            <MenuRoot className={classes.menuRoot} anchorEl={anchorEl} open={open} onClose={handleClose}>
              {renderMenuItems()}
            </MenuRoot>
          )}
        </>
      ) : (
        <RequestRoot
          className={classNames(classes.requestRoot, className)}
          variant="outlined"
          size="small"
          loading={scUserContext.user ? scEventsManager.isLoading(scEvent) : null}
          disabled={status === SCEventSubscriptionStatusType.REQUESTED}
          {...rest}>
          {getStatus}
        </RequestRoot>
      )}
    </>
  );
}