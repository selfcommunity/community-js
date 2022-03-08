import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import classNames from 'classnames';
import {
  Logger,
  SCContextType,
  SCFollowedManagerType,
  SCUserContext,
  SCUserContextType,
  SCUserType,
  UserUtils,
  useSCContext,
  useSCFetchUser
} from '@selfcommunity/core';

const PREFIX = 'SCFollowUserButton';

const classes = {
  root: `${PREFIX}-root`
};

const FollowButton = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface FollowUserButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of the user
   * @default null
   */
  userId?: number;

  /**
   * User
   * @default null
   */
  user?: SCUserType;

  /**
   * onFollow callback
   * @param user
   * @param followed
   */
  onFollow?: (user: SCUserType, followed: boolean) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-UI Follow User Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {FollowUserButton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCFollowUserButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCFollowUserButton-root|Styles applied to the root element.|

 * @param props
 */
export default function FollowUserButton(props: FollowUserButtonProps): JSX.Element {
  // PROPS
  const {className, userId, user, onFollow, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scFollowedManager: SCFollowedManagerType = scUserContext.managers.followed;
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});
  const [followed, setFollowed] = useState<boolean>(null);

  useEffect(() => {
    /**
     * Call scFollowedManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (scUserContext.user && scUserContext.user.id !== scUser.id) {
      setFollowed(scFollowedManager.isFollowed(scUser));
    }
  });

  const followUser = () => {
    if (!followed && UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning'
      });
    } else {
      scFollowedManager
        .follow(scUser)
        .then(() => {
          onFollow && onFollow(scUser, !followed);
        })
        .catch((e) => {
          Logger.error(SCOPE_SC_UI, e);
        });
    }
  };

  const handleFollowAction = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      followUser();
    }
  };

  //same user
  if (scUserContext.user && scUserContext.user.id === scUser.id) {
    return null;
  }

  return (
    <FollowButton
      size="small"
      variant="outlined"
      onClick={handleFollowAction}
      loading={scUserContext.user ? followed === null || scFollowedManager.isLoading(scUser) : null}
      className={classNames(classes.root, className)}
      {...rest}>
      {followed ? (
        <FormattedMessage defaultMessage="ui.followUserButton.unfollow" id="ui.followUserButton.unfollow" />
      ) : (
        <FormattedMessage defaultMessage="ui.followUserButton.follow" id="ui.followUserButton.follow" />
      )}
    </FollowButton>
  );
}
