import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {SwipeableDrawer, MenuItem, ListItemIcon, IconButtonProps, IconButton, Menu, useTheme, useMediaQuery, List, ListItem} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {Link, SCRoutes, SCRoutingContextType, SCThemeType, useSCRouting} from '@selfcommunity/react-core';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {PrivateMessageService} from '@selfcommunity/api-services';
import PubSub from 'pubsub-js';
import {SCUserType} from '@selfcommunity/types';

const PREFIX = 'SCPrivateMessageSettingsIconButton';

const classes = {
  root: `${PREFIX}-root`,
  drawerRoot: `${PREFIX}-drawer-root`,
  menuRoot: `${PREFIX}-menu-root`,
  paper: `${PREFIX}-paper`,
  item: `${PREFIX}-item`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const SwipeableDrawerRoot = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.drawerRoot
})(({theme}) => ({}));

const MenuRoot = styled(Menu, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.menuRoot
})(({theme}) => ({}));

export interface PrivateMessageSettingsIconButtonProps extends IconButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles callback on menu item delete click
   */
  onMenuItemDeleteClick?: () => void;
  /**
   * Handles callback on delete confirm
   */
  onItemDeleteConfirm?: () => void;
  /**
   * The deleting thread id
   */
  threadToDelete?: any;
  /**
   * The user receiver context
   */
  user?: SCUserType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS PrivateMessageSettingsIconButton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PrivateMessageSettingsIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPrivateMessageSettingsIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPrivateMessageSettingsIconButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function PrivateMessageSettingsIconButton(inProps: PrivateMessageSettingsIconButtonProps): JSX.Element {
  // PROPS
  const props: PrivateMessageSettingsIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, onMenuItemDeleteClick, user, onItemDeleteConfirm, threadToDelete, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scRoutingContext: SCRoutingContextType = useSCRouting();

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
    onItemDeleteConfirm && onItemDeleteConfirm();
  };
  /**
   * Handles thread deletion
   */
  function handleDeleteThread() {
    PrivateMessageService.deleteAThread({user: threadToDelete})
      .then(() => {
        PubSub.publish('snippetsChannelDelete', threadToDelete);
        handleCloseDialog();
      })
      .catch((error) => {
        setOpenConfirmDialog(false);
        console.log(error);
      });
  }

  /**
   *
   */
  const renderList = () => {
    if (isMobile) {
      return [
        <ListItem className={classes.item} key="delete" onClick={threadToDelete ? handleOpenDialog : onMenuItemDeleteClick}>
          <ListItemIcon>
            <Icon fontSize="small">delete</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.privateMessageSettingsIconButton.item.delete" defaultMessage="ui.privateMessageSettingsIconButton.item.delete" />
        </ListItem>,
        <ListItem className={classes.item} key="profile" component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, user)}>
          <ListItemIcon>
            <Icon fontSize="small">people_alt</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.privateMessageSettingsIconButton.item.profile" defaultMessage="ui.privateMessageSettingsIconButton.item.profile" />
        </ListItem>
      ];
    } else {
      return [
        <MenuItem className={classes.item} onClick={threadToDelete ? handleOpenDialog : onMenuItemDeleteClick} key="delete">
          <ListItemIcon>
            <Icon fontSize="small">delete</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.privateMessageSettingsIconButton.item.delete" defaultMessage="ui.privateMessageSettingsIconButton.item.delete" />
        </MenuItem>,
        <MenuItem className={classes.item} component={Link} to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, user)} key="profile">
          <ListItemIcon>
            <Icon fontSize="small">people_alt</Icon>
          </ListItemIcon>
          <FormattedMessage id="ui.privateMessageSettingsIconButton.item.profile" defaultMessage="ui.privateMessageSettingsIconButton.item.profile" />
        </MenuItem>
      ];
    }
  };

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
          title={
            <FormattedMessage id="ui.privateMessageSettingsIconButton.dialog.msg" defaultMessage="ui.privateMessageSettingsIconButton.dialog.msg" />
          }
          btnConfirm={
            <FormattedMessage
              id="ui.privateMessageSettingsIconButton.dialog.confirm"
              defaultMessage="ui.privateMessageSettingsIconButton.dialog.confirm"
            />
          }
          onConfirm={handleDeleteThread}
          onClose={handleCloseDialog}
        />
      )}
    </>
  );
}
