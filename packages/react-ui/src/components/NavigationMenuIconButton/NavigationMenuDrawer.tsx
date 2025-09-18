import React from 'react';
import {Box, Divider, Drawer, DrawerProps, Icon, IconButton, List, styled} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import ScrollContainer from '../../shared/ScrollContainer';
import DefaultDrawerContent, {DefaultDrawerContentProps} from './DefaultDrawerContent';
import DefaultHeaderContent from './DefaultHeaderContent';
import CreateLiveStreamButton, {CreateLiveStreamButtonProps} from '../CreateLiveStreamButton';

const PREFIX = 'SCNavigationMenuDrawer';

const classes = {
  root: `${PREFIX}-root`,
  logo: `${PREFIX}-logo`,
  drawerRoot: `${PREFIX}-drawer-root`,
  drawerHeader: `${PREFIX}-drawer-header`,
  drawerHeaderAction: `${PREFIX}-drawer-header-action`,
  drawerContent: `${PREFIX}-drawer-content`,
  drawerFooter: `${PREFIX}-drawer-footer`,
  drawerFooterLiveStream: `${PREFIX}-drawer-footer-live`,
  drawerFooterLiveStreamButton: `${PREFIX}-drawer-footer-live-button`
};

const Root = styled(Drawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(({theme}) => ({}));

export interface NavigationMenuDrawerProps extends DrawerProps {
  /**
   * Hide drawer header
   * @default true
   */
  showDrawerHeader?: boolean;
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
   * Default Drawer Content props content
   * @default null
   */
  defaultDrawerContentProps?: DefaultDrawerContentProps;
  /**
   * Hide drawer footer
   * @default true
   */
  showDrawerFooter?: boolean;
  /**
   * Custom Drawer footer content
   * @default null
   */
  drawerFooterContent?:
    | React.ReactNode
    | ((props: {handleCloseMenuDrawer: (event: any, reason: 'backdropClick' | 'escapeKeyDown') => void}) => React.ReactNode);
  /**
   * Props to spread to ScrollContainer component
   * This lib use 'react-custom-scrollbars' component to perform scrollbars
   * For more info: https://github.com/malte-wessel/react-custom-scrollbars/blob/master/docs/API.md
   * @default {}
   */
  ScrollContainerProps?: Record<string, any>;
  /**
   * Props to spread to CreateLiveStreamButton component
   * @default {}
   */
  CreateLiveStreamButtonComponentProps?: CreateLiveStreamButtonProps;
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
    showDrawerHeader = true,
    defaultDrawerContentProps = null,
    drawerHeaderContent = <DefaultHeaderContent />,
    drawerContent = <DefaultDrawerContent onClose={() => onClose({}, 'backdropClick')} {...defaultDrawerContentProps} />,
    showDrawerFooterContent = true,
    drawerFooterContent = null,
    ScrollContainerProps = {hideTracksWhenNotNeeded: true},
    CreateLiveStreamButtonComponentProps = {},
    open,
    onClose,
    ...rest
  } = props;

  const footerContent = (() => {
    if (typeof drawerFooterContent === 'function') {
      return drawerFooterContent({handleCloseMenuDrawer: onClose});
    }

    if (React.isValidElement(drawerFooterContent)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return React.cloneElement(drawerFooterContent, {handleCloseMenuDrawer: onClose});
    }

    return drawerFooterContent;
  })();

  return (
    <Root anchor="left" className={classNames(classes.root, className)} open={open} onClose={onClose} {...rest}>
      {showDrawerHeader && (
        <>
          <Box className={classes.drawerHeader}>
            {drawerHeaderContent}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <IconButton className={classes.drawerHeaderAction} onClick={onClose}>
              <Icon>close</Icon>
            </IconButton>
          </Box>
          <Divider />
        </>
      )}
      <ScrollContainer {...ScrollContainerProps}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <List className={classes.drawerContent}>{drawerContent}</List>
      </ScrollContainer>
      {showDrawerFooterContent && (
        <>
          <Box component="div" className={classes.drawerFooter}>
            {footerContent || (
              <Box className={classes.drawerFooterLiveStream}>
                <CreateLiveStreamButton
                  color="primary"
                  className={classes.drawerFooterLiveStreamButton}
                  fullWidth
                  {...CreateLiveStreamButtonComponentProps}
                />
              </Box>
            )}
          </Box>
        </>
      )}
    </Root>
  );
}
