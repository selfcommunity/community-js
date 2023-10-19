import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Divider, Drawer, DrawerProps, Icon, IconButton, IconButtonProps, List } from '@mui/material';
import classNames from 'classnames';
import { useThemeProps } from '@mui/system';
import ScrollContainer from '../../shared/ScrollContainer';
import DefaultDrawerContent from './DefaultDrawerContent';
import DefaultHeaderContent from './DefaultHeaderContent';

const PREFIX = 'SCNavigationMenuIconButton';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  drawerRoot: `${PREFIX}-drawer-root`,
  drawerHeader: `${PREFIX}-drawer-header`,
  drawerHeaderAction: `${PREFIX}-drawer-header-action`,
  drawerContent: `${PREFIX}-drawer-content`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const DrawerRoot = styled(Drawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.drawerRoot
})(({theme}) => ({}));

export interface NavigationMenuIconButtonProps extends IconButtonProps {
  /**
   * Props to spread to drawer element
   * @default {anchor: 'left'}
   */
  DrawerProps?: DrawerProps;
  /**
   * Custom Drawer header content
   * @default null
   */
  drawerHeaderContent?: React.ReactNode;
  /**
   * Custom Drawer content
   * @default null
   */
  drawerContent?: React.ReactNode;
  /**
   * Props to spread to ScrollContainer component
   * This lib use 'react-custom-scrollbars' component to perform scrollbars
   * For more info: https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   * @default {}
   */
  ScrollContainerProps?: Record<string, any>;
}

/**
 * > API documentation for the Community-JS Navigation Menu Icon Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {NavigationMenuIconButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCNavigationMenuIconButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCNavigationMenuIconButton-root|Styles applied to the root element.|
 |drawerRoot|.SCNavigationMenuIconButton-drawer-root|Styles applied to the drawer root element.|
 |drawerHeader|.SCNavigationMenuIconButton-drawer-header|Styles applied to the drawer header.|
 |drawerHeaderAction|.SCNavigationMenuIconButton-drawer-header-action|Styles applied to the drawer header action element.|
 |drawerContent|.SCNavigationMenuIconButton-drawer-content|Styles applied to the drawer content.|

 * @param inProps
 */
export default function NavigationMenuIconButton(inProps: NavigationMenuIconButtonProps): JSX.Element {
  // PROPS
  const props: NavigationMenuIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    DrawerProps = {anchor: 'left'},
    drawerContent = <DefaultDrawerContent />,
    drawerHeaderContent = <DefaultHeaderContent />,
    ScrollContainerProps = {},
    ...rest
  } = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // HANDLERS
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={handleOpen}>
        <Icon>menu</Icon>
      </Root>
      <DrawerRoot className={classes.drawerRoot} {...DrawerProps} open={Boolean(anchorEl)} onClose={handleClose}>
        <Box className={classes.drawerHeader}>
          {drawerHeaderContent}
          <IconButton className={classes.drawerHeaderAction} onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
        </Box>
        <Divider />
        <ScrollContainer {...ScrollContainerProps}>
          <List className={classes.drawerContent} onClick={handleClose}>
            {drawerContent}
          </List>
        </ScrollContainer>
      </DrawerRoot>
    </>
  );
}
