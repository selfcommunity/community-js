import React from 'react';
import {styled} from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import classNames from 'classnames';

const PREFIX = 'SCBaseDrawer';

const classes = {
  root: `${PREFIX}-root`
};

export enum AnchorDirection {
  TOP = 'top',
  LEFT = 'left',
  BOTTOM = 'bottom',
  RIGHT = 'right'
}

const Root = styled(SwipeableDrawer, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& aside ': {width: '100% !important'},
  zIndex: 1300
}));

type Anchor = AnchorDirection.TOP | AnchorDirection.LEFT | AnchorDirection.BOTTOM | AnchorDirection.RIGHT;

export interface BaseDrawerProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Side from which the drawer will appear.
   */
  anchor?: Anchor;
  /**
   * Handles drawer open state
   * @default false
   */
  open?: boolean;
  /**
   * Handles drawer closing
   * @default null
   */
  onClose?: (event?: any) => any;
  /**
   * Drawer width
   */
  width?: string;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function BaseDrawer(props: BaseDrawerProps) {
  // PROPS
  const {className, open = false, onClose = null, anchor = AnchorDirection.BOTTOM, width = '85%', ...rest} = props;
  const {children} = rest;
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const toggleDrawer = (anchor: AnchorDirection, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
  };
  /**
   * Renders root object
   */
  return (
    <Root
      className={classNames(classes.root, className)}
      anchor={anchor}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={open}
      onOpen={toggleDrawer(anchor, true)}
      onClose={onClose}
      PaperProps={{
        sx: {width: width}
      }}>
      {children}
    </Root>
  );
}
