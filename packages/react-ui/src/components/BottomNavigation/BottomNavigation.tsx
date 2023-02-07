import {
  Badge,
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  BottomNavigationProps as MuiBottomNavigationProps,
  Icon,
  styled
} from '@mui/material';
import React, {useMemo} from 'react';
import {Link, SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {SCNavigationRoutesType} from '../../types';

const PREFIX = 'SCBottomNavigation';

const classes = {
  root: `${PREFIX}-root`,
  action: `${PREFIX}-action`
};

const Root = styled(MuiBottomNavigation, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  backgroundColor: theme.palette?.navbar?.main,
  [`& .${classes.action}`]: {
    fontSize: '1.571rem'
  }
}));

export interface BottomNavigationProps extends MuiBottomNavigationProps {
  /**
   * The single routes url to pass to menu
   */
  routes?: SCNavigationRoutesType;
}

const PREFERENCES = [SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED, SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY];

/**
 * > API documentation for the Community-JS BottomNavigation component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {BottomNavigation} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCBottomNavigation` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCBottomNavigation-root|Styles applied to the root element.|
 |action|.SCBottomNavigation-action|Styles applied to the action.|
 *
 * @param inProps
 */
export default function BottomNavigation(inProps: BottomNavigationProps) {
  // PROPS
  const props: BottomNavigationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {routes = {}, className, children = null, ...rest} = props;
  console.log(props);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const preferences = useMemo(() => {
    const _preferences = {};
    PREFERENCES.map((p) => (_preferences[p] = p in scPreferences.preferences ? scPreferences.preferences[p].value : null));
    return _preferences;
  }, [scPreferences.preferences]);

  // RENDER
  return (
    <Root className={classNames(className, classes.root)} {...rest}>
      {children
        ? children
        : [
            scUserContext.user ? (
              <BottomNavigationAction className={classes.action} component={Link} to={routes.explore} value="home" icon={<Icon>home</Icon>} />
            ) : null,
            (scUserContext.user || preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY]) &&
            preferences[SCPreferences.CONFIGURATIONS_EXPLORE_STREAM_ENABLED] ? (
              <BottomNavigationAction
                className={classes.action}
                component={Link}
                to={routes.explore}
                value={routes.explore}
                icon={<Icon>explore</Icon>}
              />
            ) : null,
            scUserContext.user ? (
              <BottomNavigationAction
                className={classes.action}
                component={Link}
                to={routes.notifications}
                value={routes.notifications}
                icon={
                  <Badge
                    badgeContent={scUserContext.user.unseen_notification_banners_counter + scUserContext.user.unseen_interactions_counter}
                    color="secondary">
                    <Icon>notifications_active</Icon>
                  </Badge>
                }
              />
            ) : null,
            scUserContext.user ? (
              <BottomNavigationAction
                className={classes.action}
                component={Link}
                to={routes.messages}
                value={routes.messages}
                icon={
                  <Badge
                    badgeContent={scUserContext.user.unseen_notification_banners_counter + scUserContext.user.unseen_interactions_counter}
                    color="secondary">
                    <Icon>email</Icon>
                  </Badge>
                }
              />
            ) : null
          ]}
    </Root>
  );
}
