import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserType} from '@selfcommunity/types';
import {
  Link,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  useSCFetchUser,
  useSCRouting
} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import Bullet from '../../shared/Bullet';

const PREFIX = 'SCUserCounters';

const classes = {
  root: `${PREFIX}-root`,
  button: `${PREFIX}-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface UserCountersProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Id of user object
   * @default null
   */
  userId?: number;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS User Counters component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserCounters} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserCounters` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserCounters-root|Styles applied to the root element.|
 |field|.SCUserCounters-field|Styles applied to the field element.|

 * @param inProps
 */
export default function UserCounters(inProps: UserCountersProps): JSX.Element {
  // PROPS
  const props: UserCountersProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  // HOOKS
  const {scUser} = useSCFetchUser({id: userId, user});

  if (!scUser) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {followEnabled ? (
        <>
          <Button
            className={classes.button}
            variant="text"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWINGS_ROUTE_NAME, scUser)}>
            <FormattedMessage
              id="ui.userCounters.followings"
              defaultMessage="ui.userCounters.followings"
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              values={{count: scUser?.followings_counter, b: (chunks) => <strong>{chunks}</strong>}}
            />
          </Button>
          <Bullet />
          <Button
            className={classes.button}
            variant="text"
            component={Link}
            to={scRoutingContext.url(SCRoutes.USER_PROFILE_FOLLOWERS_ROUTE_NAME, scUser)}>
            <FormattedMessage
              id="ui.userCounters.followers"
              defaultMessage="ui.userCounters.followers"
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              values={{count: scUser?.followers_counter, b: (chunks) => <strong>{chunks}</strong>}}
            />
          </Button>
        </>
      ) : (
        <Button
          className={classes.button}
          variant="text"
          component={Link}
          to={scRoutingContext.url(SCRoutes.USER_PROFILE_CONNECTIONS_ROUTE_NAME, scUser)}>
          <FormattedMessage
            id="ui.userCounters.connections"
            defaultMessage="ui.userCounters.connections"
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            values={{count: scUser?.connections_counter, b: (chunks) => <strong>{chunks}</strong>}}
          />
        </Button>
      )}
      <Bullet />
      <Button
        className={classes.button}
        variant="text"
        component={Link}
        to={scRoutingContext.url(SCRoutes.USER_PROFILE_CATEGORIES_ROUTE_NAME, scUser)}>
        <FormattedMessage
          id="ui.userCounters.categories"
          defaultMessage="ui.userCounters.categories"
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          values={{count: scUser?.categories_counter, b: (chunks) => <strong>{chunks}</strong>}}
        />
      </Button>
    </Root>
  );
}
