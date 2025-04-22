import React, {useCallback, useState} from 'react';
import {Icon, IconButton, IconButtonProps, styled} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCPreferences, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import NavigationMenuDrawer, {NavigationMenuDrawerProps} from './NavigationMenuDrawer';

const PREFIX = 'SCNavigationMenuIconButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NavigationMenuIconButtonProps extends IconButtonProps {
  /**
   * Prop to show/hide the default drawer component
   * @default true
   */
  showDrawer?: boolean;
  /**
   * Callback triggered on menu click
   * @default null
   */
  onMenuIconClick?: () => void;
  /**
   * Props to spread to default drawer root
   * @default {}
   */
  DrawerProps?: NavigationMenuDrawerProps;
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

 * @param inProps
 */
export default function NavigationMenuIconButton(inProps: NavigationMenuIconButtonProps): JSX.Element {
  // PROPS
  const props: NavigationMenuIconButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, DrawerProps = {}, onMenuIconClick = null, showDrawer = true, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // CONTEXT
  const {preferences} = useSCPreferences();
  const scUserContext = useSCUser();

  // HANDLERS
  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  if (!preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value && !scUserContext.user?.id) {
    return null;
  }

  return (
    <>
      <Root className={classNames(classes.root, className)} {...rest} onClick={onMenuIconClick ?? handleOpen}>
        <Icon>menu</Icon>
      </Root>
      {showDrawer && <NavigationMenuDrawer open={Boolean(anchorEl)} onClose={handleClose} {...DrawerProps} />}
    </>
  );
}
