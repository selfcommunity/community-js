import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Divider, IconButton, IconButtonProps, List, ListItemIcon, Menu, MenuItem, SwipeableDrawer, useMediaQuery, useTheme} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCRoutes, SCRoutingContextType, SCThemeType, SCUserContextType, useSCFetchEvent, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {EventService} from '@selfcommunity/api-services';
import {SCEventPrivacyType, SCEventSubscriptionStatusType, SCEventType} from '@selfcommunity/types';
import {ADD_EVENT_TO_CALENDAR, CANCEL_EVENT, GET_EVENT_LINK} from '../../constants/EventActionsMenu';
import {copyTextToClipboard} from '@selfcommunity/utils';
import {enqueueSnackbar} from 'notistack';
import HiddenPlaceholder from '../HiddenPlaceholder';

const PREFIX = 'SCEventActionsMenu';

const classes = {
  root: `${PREFIX}-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'DrawerRoot'
})(() => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'MenuRoot'
})(() => ({}));

export interface EventActionsMenuProps extends IconButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The event
   */
  event: SCEventType;
  /**
   * The event id
   */
  eventId?: number;
  /**
   * Handles callback on delete confirm
   */
  onDeleteConfirm?: () => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS EventActionsMenu component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {EventActionsMenu} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCEventActionsMenu` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCEventActionsMenu-root|Styles applied to the root element.|
 |drawerRoot|.SCEventActionsMenu-drawer-root|Styles applied to the drawer root element.|
 |menuRoot|.SCEventActionsMenu-menu-root|Styles applied to the menu root element.|
 |paper|.SCEventActionsMenu-paper|Styles applied to the paper element.|
 |item|.SCEventActionsMenu-item|Styles applied to the item element.|


 * @param inProps
 */
export default function EventActionsMenu(inProps: EventActionsMenuProps): JSX.Element {
  // PROPS
  const props: EventActionsMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, event, eventId, onDeleteConfirm, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scUserContext: SCUserContextType = useSCUser();
  const {scEvent} = useSCFetchEvent({id: eventId, event});

  const isEventAdmin = useMemo(
    () => scUserContext.user && scEvent?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scEvent?.managed_by?.id]
  );

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setAnchorEl(null);
  };
  /**
   * Handles thread deletion
   */
  function handleDeleteThread() {
    EventService.deleteEvent(scEvent.id)
      .then(() => {
        onDeleteConfirm();
        handleCloseDialog();
      })
      .catch((error) => {
        setOpenConfirmDialog(false);
        console.log(error);
      });
  }

  const createGoogleCalendarLink = (event) => {
    const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
    return `${baseUrl}&text=${encodeURIComponent(event.name)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(
      event.geolocation
    )}&dates=${event.start_date}/${event.end_date}`;
  };

  /**
   * Handles actions
   */
  function handleAction(action) {
    if (action === GET_EVENT_LINK) {
      copyTextToClipboard(`${location.protocol}//${location.host}${scRoutingContext.url(SCRoutes.EVENT_ROUTE_NAME, scEvent)}`).then(() => {
        enqueueSnackbar(<FormattedMessage id="ui.common.permanentLinkCopied" defaultMessage="ui.common.permanentLinkCopied" />, {
          variant: 'success',
          autoHideDuration: 3000
        });
      });
      handleClose();
    } else if (action === ADD_EVENT_TO_CALENDAR) {
      window.open(createGoogleCalendarLink(scEvent), '_blank', 'noopener,noreferrer');
      handleClose();
    } else if (action === CANCEL_EVENT) {
      setOpenConfirmDialog(true);
      handleClose();
    }
  }

  /**
   *
   */
  const renderList = () => {
    return [
      <MenuItem className={classes.item} key="link" onClick={() => handleAction(GET_EVENT_LINK)}>
        <ListItemIcon>
          <Icon>link</Icon>
        </ListItemIcon>
        <FormattedMessage id="ui.shared.eventActionsMenu.item.link" defaultMessage="ui.shared.eventActionsMenu.item.link" />
      </MenuItem>,
      <MenuItem className={classes.item} key="calendar" onClick={() => handleAction(ADD_EVENT_TO_CALENDAR)}>
        <ListItemIcon>
          <Icon>CalendarIcon</Icon>
        </ListItemIcon>
        <FormattedMessage id="ui.shared.eventActionsMenu.item.calendar" defaultMessage="ui.shared.eventActionsMenu.item.calendar" />
      </MenuItem>,
      isEventAdmin && [
        <Divider key="divider" />,
        <MenuItem className={classes.item} onClick={() => handleAction(CANCEL_EVENT)} key="cancel">
          <ListItemIcon>
            <Icon>close</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.shared.eventActionsMenu.item.cancel" defaultMessage="ui.shared.eventActionsMenu.item.cancel" />
        </MenuItem>
      ]
    ];
  };

  if (
    !scUserContext.user ||
    (scEvent?.privacy === SCEventPrivacyType.PRIVATE && !isEventAdmin && scEvent?.subscription_status !== SCEventSubscriptionStatusType.SUBSCRIBED)
  ) {
    return <HiddenPlaceholder />;
  }

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleOpen}>
        <Icon>more_vert</Icon>
      </Root>
      {isMobile ? (
        <SwipeableDrawerRoot
          className={classes.drawerRoot}
          anchor="bottom"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onOpen={handleOpen}
          PaperProps={{className: classes.paper}}
          disableSwipeToOpen>
          <List>{renderList()}</List>
        </SwipeableDrawerRoot>
      ) : (
        <MenuRoot
          className={classes.menuRoot}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{className: classes.paper}}>
          {renderList()}
        </MenuRoot>
      )}
      {openConfirmDialog && (
        <ConfirmDialog
          open={openConfirmDialog}
          title={<FormattedMessage id="ui.shared.eventActionsMenu.dialog.msg" defaultMessage="ui.shared.eventActionsMenu.dialog.msg" />}
          btnConfirm={<FormattedMessage id="ui.shared.eventActionsMenu.dialog.confirm" defaultMessage="ui.shared.eventActionsMenu.dialog.confirm" />}
          onConfirm={handleDeleteThread}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
