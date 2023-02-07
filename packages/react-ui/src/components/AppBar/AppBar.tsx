import {AppBar as MuiAppBar, AppBarProps as MuiAppBarProps, styled} from '@mui/material';
import React from 'react';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCAppBar';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(MuiAppBar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  backgroundColor: theme.palette?.navbar?.main
}));

export type AppBarProps = MuiAppBarProps;

/**
 * > API documentation for the Community-JS AppBar component. Learn about the available props and the CSS API.
 * The AppBar component is a bridge between BottomNavigation and MobileHeader header. It loads the right component based on the screen resolution.

 #### Import

 ```jsx
 import {AppBar} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCHeader` can be used when providing style overrides in the theme.

 *
 * @param inProps
 */
export default function AppBar(inProps: AppBarProps) {
  // PROPS
  const props: AppBarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, ...rest} = props;

  return <Root className={classNames(classes.root, className)} {...rest} />;
}
