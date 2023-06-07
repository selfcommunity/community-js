import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Divider, Grid, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {SCUserType} from '@selfcommunity/types';
import {SCUserContextType, useSCFetchUser, useSCFetchUserBlockedBy, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCUserProfileBlocked';

const classes = {
  root: `${PREFIX}-root`,
  info: `${PREFIX}-info`,
  button: `${PREFIX}-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  textAlign: 'center'
}));

export interface UserProfileBlockedProps {
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
   * Prefetch blockedBy
   * @default null
   */
  blockedByUser?: boolean | null;

  /**
   * Enable sync status blockedBy
   * @default false
   */
  syncBlockedByUserStatus?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *
 > API documentation for the Community-JS User Profile Blocked component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfileBlocked} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserProfileBlocked` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileBlocked-root|Styles applied to the root element.|
 |info|.SCUserProfileBlocked-info|Styles applied to info text element.|
 |button|.SCUserProfileBlocked-button|Styles applied to the unblock button element.|

 * @param inProps
 */
export default function UserProfileBlocked(inProps: UserProfileBlockedProps): JSX.Element {
  // PROPS
  const props: UserProfileBlockedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, userId = null, user = null, blockedByUser = null, syncBlockedByUserStatus = false, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {scUser} = useSCFetchUser({id: userId, user});
  const {blockedBy, loading: loadingBlockedBy} = useSCFetchUserBlockedBy({user: scUser, blockedByUser, sync: syncBlockedByUserStatus});

  // CONST
  const isMe = useMemo(() => scUserContext.user && scUser?.id === scUserContext.user.id, [scUserContext.user, scUser]);

  if (!scUser || loadingBlockedBy) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Divider />
      {!isMe && blockedBy && (
        <Typography variant="body1" className={classes.info}>
          <FormattedMessage id="ui.userProfileBlocked.blockedUserBy" defaultMessage="ui.userProfileBlocked.blockedUserBy" />
        </Typography>
      )}
      {!isMe && scUserContext.managers.blockedUsers.isBlocked(scUser) && (
        <>
          <Typography variant="body1" className={classes.info}>
            <FormattedMessage id="ui.userProfileBlocked.blockedUser" defaultMessage="ui.userProfileBlocked.blockedUser" />
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => scUserContext.managers.blockedUsers.block(scUser)}
            disabled={scUserContext.managers.blockedUsers.isLoading()}>
            <FormattedMessage id="ui.userProfileBlocked.unBlockUser" defaultMessage="ui.userProfileBlocked.unBlockUser" />
          </Button>
        </>
      )}
    </Root>
  );
}
