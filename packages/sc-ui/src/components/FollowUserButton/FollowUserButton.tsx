import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import {Logger, SCFollowedManagerType, SCUserContext, SCUserContextType, SCUserType, useSCFetchUser} from '@selfcommunity/core';
import classNames from 'classnames';

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

export default function FollowUserButton(props: FollowUserButtonProps): JSX.Element {
  // PROPS
  const {className, userId, user, onFollow, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scFollowedManager: SCFollowedManagerType = scUserContext.managers.followed;

  // STATE
  const {scUser, setSCUser} = useSCFetchUser({id: userId, user});
  const [followed, setFollowed] = useState<boolean>(null);

  useEffect(() => {
    /**
     * Call scFollowedManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (scUserContext.user.id !== scUser.id) {
      setFollowed(scFollowedManager.isFollowed(scUser));
    }
  });

  const followCUser = () => {
    scFollowedManager
      .follow(scUser)
      .then(() => {
        onFollow && onFollow(scUser, !followed);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  // User anonymous || same user
  if (!scUserContext.user || scUserContext.user.id === scUser.id) {
    return null;
  }

  return (
    <FollowButton
      size="small"
      variant="outlined"
      onClick={followCUser}
      loading={followed === null || scFollowedManager.isLoading(scUser)}
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
