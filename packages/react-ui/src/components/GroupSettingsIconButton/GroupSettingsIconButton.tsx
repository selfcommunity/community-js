import React, {useMemo, useState} from 'react';
import {SwipeableDrawer, MenuItem, IconButtonProps, IconButton, Menu, useTheme, useMediaQuery, List, ListItem, styled, Icon} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {
  GroupUtils,
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCThemeType,
  SCUserContextType,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {SCGroupType, SCUserType} from '@selfcommunity/types';
import {GroupService} from '@selfcommunity/api-services';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';
import {enqueueSnackbar} from 'notistack';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';

const PREFIX = 'SCGroupSettingsIconButton';

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

export interface GroupSettingsIconButtonProps extends IconButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles callback on delete success
   */
  onRemoveSuccess?: () => void;
  /**
   * True if the user is an admin of the group
   * @default false
   */
  isAdmin?: boolean;
  /**
   * Handles callback when the user is elected admin or removed from the admins
   */
  onAdminChange?: (isAdmin: boolean) => void;
  /**
   * The user
   */
  user: SCUserType;
  /**
   * The group obj
   */
  group: SCGroupType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS GroupSettingsIconButton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupSettingsIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupSettingsIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupSettingsIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function GroupSettingsIconButton(inProps: GroupSettingsIconButtonProps): JSX.Element {
  // PROPS
  const props: GroupSettingsIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, group, user, onRemoveSuccess, isAdmin = false, onAdminChange, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openRemoveAdminDialog, setOpenRemoveAdminDialog] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const {preferences}: SCPreferencesContextType = useSCPreferences();

  const privateMessagingEnabled = useMemo(
    () => SCPreferences.ADDONS_PRIVATE_MESSAGES_ENABLED in preferences && preferences[SCPreferences.ADDONS_PRIVATE_MESSAGES_ENABLED].value,
    [preferences]
  );

  // CONST
  const isMe = scUserContext?.user?.id === user?.id;
  const isGroupAdmin = GroupUtils.isGroupAdmin(group, scUserContext.user);
  const isGroupCreator = GroupUtils.isGroupCreator(group, scUserContext.user);
  const isUserCreator = GroupUtils.isGroupCreator(group, user);
  // Any admin can elect a member
  const canAddAdmin = isGroupAdmin && !isAdmin && !isMe;
  // Only the creator can remove an admin, or the admin itself can give up the role
  const canRemoveAdmin = isAdmin && !isUserCreator && (isGroupCreator || isMe);
  // Only the creator can remove an admin from the group, the other admins can remove only the members
  const canRemoveUser = isGroupAdmin && !isMe && !isUserCreator && (!isAdmin || isGroupCreator);

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenConfirmDialog(true);
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
    setAnchorEl(null);
  };

  const handleOpenRemoveAdminDialog = () => {
    setOpenRemoveAdminDialog(true);
    setAnchorEl(null);
  };
  const handleCloseRemoveAdminDialog = () => {
    setOpenRemoveAdminDialog(false);
    setAnchorEl(null);
  };

  /**
   * Notify UI when a user is removed from a group
   * @param group
   * @param user
   */
  function notifyChanges(group: SCGroupType, user: SCUserType) {
    if (group && user) {
      PubSub.publish(`${SCTopicType.GROUP}.${SCGroupEventType.REMOVE_MEMBER}`, {group, user});
    }
  }

  /**
   * Handles thread deletion
   */
  function handleRemoveUser() {
    GroupService.removeUserFromGroup(group.id, user.id)
      .then(() => {
        notifyChanges(group, user);
        onRemoveSuccess && onRemoveSuccess();
        handleCloseDialog();
      })
      .catch((error) => {
        setOpenConfirmDialog(false);
        Logger.error(SCOPE_SC_UI, error);
        enqueueSnackbar(<FormattedMessage id="ui.groupSettingsIconButton.error.remove" defaultMessage="ui.groupSettingsIconButton.error.remove" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      });
  }

  /**
   * Handles admin election
   */
  function handleAddAdmin() {
    handleClose();
    GroupService.addGroupAdmins(group.id, {users: [user.id]})
      .then(() => {
        PubSub.publish(`${SCTopicType.GROUP}.${SCGroupEventType.ADD_ADMIN}`, {group, user});
        onAdminChange && onAdminChange(true);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
        enqueueSnackbar(
          <FormattedMessage id="ui.groupSettingsIconButton.error.addAdmin" defaultMessage="ui.groupSettingsIconButton.error.addAdmin" />,
          {
            variant: 'error',
            autoHideDuration: 3000
          }
        );
      });
  }

  /**
   * Handles admin removal
   */
  function handleRemoveAdmin() {
    GroupService.removeGroupAdmin(group.id, user.id)
      .then(() => {
        PubSub.publish(`${SCTopicType.GROUP}.${SCGroupEventType.REMOVE_ADMIN}`, {group, user});
        onAdminChange && onAdminChange(false);
        handleCloseRemoveAdminDialog();
      })
      .catch((error) => {
        setOpenRemoveAdminDialog(false);
        Logger.error(SCOPE_SC_UI, error);
        enqueueSnackbar(
          <FormattedMessage id="ui.groupSettingsIconButton.error.removeAdmin" defaultMessage="ui.groupSettingsIconButton.error.removeAdmin" />,
          {
            variant: 'error',
            autoHideDuration: 3000
          }
        );
      });
  }

  if ((isMe || !privateMessagingEnabled) && !canAddAdmin && !canRemoveAdmin && !canRemoveUser) {
    return null;
  }

  /**
   *
   */
  const renderList = () => {
    const Item: any = isMobile ? ListItem : MenuItem;
    return [
      privateMessagingEnabled && !isMe && (
        <Item className={classes.item} key="message" component={Link} to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, user)}>
          <FormattedMessage id="ui.groupSettingsIconButton.item.message" defaultMessage="ui.groupSettingsIconButton.item.message" />
        </Item>
      ),
      canAddAdmin && (
        <Item className={classes.item} key="addAdmin" onClick={handleAddAdmin}>
          <FormattedMessage id="ui.groupSettingsIconButton.item.addAdmin" defaultMessage="ui.groupSettingsIconButton.item.addAdmin" />
        </Item>
      ),
      canRemoveAdmin && (
        <Item className={classes.item} key="removeAdmin" onClick={handleOpenRemoveAdminDialog}>
          <FormattedMessage id="ui.groupSettingsIconButton.item.removeAdmin" defaultMessage="ui.groupSettingsIconButton.item.removeAdmin" />
        </Item>
      ),
      canRemoveUser && (
        <Item className={classes.item} key="delete" onClick={handleOpenDialog}>
          <FormattedMessage id="ui.groupSettingsIconButton.item.remove" defaultMessage="ui.groupSettingsIconButton.item.remove" />
        </Item>
      )
    ];
  };

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleOpen}>
        <Icon>more_vert</Icon>
      </Root>
      {Boolean(anchorEl) && (
        <>
          {isMobile ? (
            <SwipeableDrawerRoot
              className={classes.drawerRoot}
              anchor="bottom"
              open
              onClose={handleClose}
              onOpen={handleOpen}
              slotProps={{
                paper: {
                  className: classes.paper
                }
              }}
              disableSwipeToOpen>
              <List>{renderList()}</List>
            </SwipeableDrawerRoot>
          ) : (
            <MenuRoot
              className={classes.menuRoot}
              anchorEl={anchorEl}
              open
              onClose={handleClose}
              slotProps={{
                paper: {
                  className: classes.paper
                }
              }}>
              {renderList()}
            </MenuRoot>
          )}
        </>
      )}
      {openConfirmDialog && (
        <ConfirmDialog
          open={openConfirmDialog}
          title={
            <FormattedMessage
              id="ui.groupSettingsIconButton.dialog.msg"
              defaultMessage="ui.groupSettingsIconButton.dialog.msg"
              values={{
                b: (chunks) => <strong key="ui.groupSettingsIconButton.dialog.msg.b">{chunks}</strong>,
                user: user.username,
                group: group.name
              }}
            />
          }
          btnConfirm={<FormattedMessage id="ui.groupSettingsIconButton.dialog.confirm" defaultMessage="ui.groupSettingsIconButton.dialog.confirm" />}
          onConfirm={handleRemoveUser}
          onClose={handleCloseDialog}
        />
      )}
      {openRemoveAdminDialog && (
        <ConfirmDialog
          open={openRemoveAdminDialog}
          title={
            isMe ? (
              <FormattedMessage
                id="ui.groupSettingsIconButton.dialog.removeAdmin.me"
                defaultMessage="ui.groupSettingsIconButton.dialog.removeAdmin.me"
                values={{group: group.name}}
              />
            ) : (
              <FormattedMessage
                id="ui.groupSettingsIconButton.dialog.removeAdmin"
                defaultMessage="ui.groupSettingsIconButton.dialog.removeAdmin"
                values={{
                  b: (chunks) => <strong key="ui.groupSettingsIconButton.dialog.removeAdmin.b">{chunks}</strong>,
                  user: user.username,
                  group: group.name
                }}
              />
            )
          }
          btnConfirm={<FormattedMessage id="ui.groupSettingsIconButton.dialog.confirm" defaultMessage="ui.groupSettingsIconButton.dialog.confirm" />}
          onConfirm={handleRemoveAdmin}
          onClose={handleCloseRemoveAdminDialog}
        />
      )}
    </>
  );
}
