import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Divider, Drawer, DrawerProps, Icon, IconButton, List} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import ScrollContainer from '../../shared/ScrollContainer';
import DefaultDrawerContent from './DefaultDrawerContent';
import DefaultHeaderContent from './DefaultHeaderContent';

const PREFIX = 'SCNavigationMenuDrawer';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  drawerRoot: `${PREFIX}-drawer-root`,
  drawerHeader: `${PREFIX}-drawer-header`,
  drawerHeaderAction: `${PREFIX}-drawer-header-action`,
  drawerContent: `${PREFIX}-drawer-content`
};

const Root = styled(Drawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NavigationMenuDrawerProps extends DrawerProps {
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
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function NavigationMenuDrawer(inProps: NavigationMenuDrawerProps): JSX.Element {
  // PROPS
  const props: NavigationMenuDrawerProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    drawerHeaderContent = <DefaultHeaderContent />,
    drawerContent = <DefaultDrawerContent />,
    ScrollContainerProps = {},
    open,
    onClose,
    ...rest
  } = props;

  return (
    <Root className={classNames(classes.root, className)} open={open} onClose={onClose} {...rest}>
      <Box className={classes.drawerHeader}>
        {drawerHeaderContent}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <IconButton className={classes.drawerHeaderAction} onClick={onClose}>
          <Icon>close</Icon>
        </IconButton>
      </Box>
      <Divider />
      <ScrollContainer {...ScrollContainerProps}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <List className={classes.drawerContent} onClick={onClose}>
          {drawerContent}
        </List>
      </ScrollContainer>
    </Root>
  );
}
