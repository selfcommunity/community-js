import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Divider, Drawer, DrawerProps, Icon, IconButton, List} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import ScrollContainer from '../../shared/ScrollContainer';
import DefaultDrawerContent from './DefaultDrawerContent';
import DefaultHeaderContent from './DefaultHeaderContent';
import PubSub from 'pubsub-js';
import {SCLayoutEventType, SCTopicType} from '../../constants/PubSub';

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
   * Override onClose
   */
  handleOnClose?: () => void;
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
    handleOnClose,
    ...rest
  } = props;

  // REFS
  const refreshSubscription = useRef(null);

  const [open, setOpen] = useState<boolean>(props.open);

  // HANDLERS
  const onClose = useCallback(() => {
    if (handleOnClose) {
      handleOnClose();
    } else {
      setOpen(false);
    }
  }, [open]);

  // Subscriber for pubsub callback
  const subscriber = useCallback((msg, data) => {
    setOpen(data.open);
  }, []);

  /**
   * When a ws notification arrives, update data
   */
  useEffect(() => {
    refreshSubscription.current = PubSub.subscribe(`${SCTopicType.LAYOUT}.${SCLayoutEventType.DRAWER}`, subscriber);
    return () => {
      PubSub.unsubscribe(refreshSubscription.current);
    };
  }, []);

  return (
    <Root anchor="left" className={classNames(classes.root, className)} open={open} onClose={onClose} {...rest}>
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
        <List className={classes.drawerContent} onClick={onClose}>
          {drawerContent}
        </List>
      </ScrollContainer>
    </Root>
  );
}
