import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCContextType, SCSubscribedGroupsManagerType, SCUserContextType, useSCContext, useSCFetchGroup, useSCUser} from '@selfcommunity/react-core';
import {SCGroupPrivacyType, SCGroupSubscriptionStatusType, SCGroupType, SCUserType} from '@selfcommunity/types';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCOPE_SC_UI} from '../../constants/Errors';

const PREFIX = 'SCGroupSubscribeButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface GroupSubscribeButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Group Object
   * @default null
   */
  group?: SCGroupType;

  /**
   * Id of the group
   * @default null
   */
  groupId?: number;

  /**
   * The user to be accepted into the group
   * @default null
   */
  user?: SCUserType;

  /**
   * onSubscribe callback
   * @param user
   * @param joined
   */
  onSubscribe?: (group: SCGroupType, status: string | null) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Group Subscribe Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupSubscribeButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroupSubscribeButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroupSubscribeButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function GroupSubscribeButton(inProps: GroupSubscribeButtonProps): JSX.Element {
  // PROPS
  const props: GroupSubscribeButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, groupId, group, user, onSubscribe, ...rest} = props;

  // STATE
  const [status, setStatus] = useState<string>(null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scGroupsManager: SCSubscribedGroupsManagerType = scUserContext.managers.groups;

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  const {scGroup} = useSCFetchGroup({
    id: groupId,
    group,
    cacheStrategy: authUserId ? CacheStrategies.CACHE_FIRST : CacheStrategies.STALE_WHILE_REVALIDATE
  });

  const isGroupAdmin = useMemo(
    () => scUserContext.user && scGroup?.managed_by?.id === scUserContext.user.id,
    [scUserContext.user, scGroup?.managed_by?.id]
  );

  useEffect(() => {
    /**
     * Call scGroupsManager.subscriptionStatus inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setStatus(scGroupsManager.subscriptionStatus(scGroup));
    }
  }, [authUserId, scGroupsManager.subscriptionStatus]);

  const subscribe = (userId?: number) => {
    scGroupsManager
      .subscribe(scGroup, userId)
      .then(() => {
        onSubscribe && onSubscribe(scGroup, SCGroupSubscriptionStatusType.SUBSCRIBED);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const unsubscribe = () => {
    scGroupsManager
      .unsubscribe(scGroup)
      .then(() => {
        onSubscribe && onSubscribe(scGroup, null);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleSubscribeAction = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      status === SCGroupSubscriptionStatusType.SUBSCRIBED && !user?.id ? unsubscribe() : user?.id ? subscribe(user?.id) : subscribe();
    }
  };

  /**
   * Get current translated status
   */
  const getStatus = (): JSX.Element => {
    let _status;
    switch (status) {
      case SCGroupSubscriptionStatusType.REQUESTED:
        _status = <FormattedMessage defaultMessage="ui.groupSubscribeButton.waitingApproval" id="ui.groupSubscribeButton.waitingApproval" />;
        break;
      case SCGroupSubscriptionStatusType.SUBSCRIBED:
        _status = <FormattedMessage defaultMessage="ui.groupSubscribeButton.exit" id="ui.groupSubscribeButton.exit" />;
        break;
      case SCGroupSubscriptionStatusType.INVITED:
        _status = <FormattedMessage defaultMessage="ui.groupSubscribeButton.accept" id="ui.groupSubscribeButton.accept" />;
        break;
      default:
        scGroup.privacy === SCGroupPrivacyType.PUBLIC
          ? (_status = <FormattedMessage defaultMessage="ui.groupSubscribeButton.enter" id="ui.groupSubscribeButton.enter" />)
          : (_status = <FormattedMessage defaultMessage="ui.groupSubscribeButton.requestAccess" id="ui.groupSubscribeButton.requestAccess" />);
        break;
    }
    return _status;
  };

  if (!scGroup || (isGroupAdmin && user?.id === scUserContext.user.id) || (isGroupAdmin && !user?.id)) {
    return null;
  }

  return (
    <Root
      size="small"
      variant="outlined"
      onClick={handleSubscribeAction}
      loading={scUserContext.user ? scGroupsManager.isLoading(scGroup) : null}
      disabled={status === SCGroupSubscriptionStatusType.REQUESTED}
      className={classNames(classes.root, className)}
      {...rest}>
      {isGroupAdmin ? <FormattedMessage defaultMessage="ui.groupSubscribeButton.accept" id="ui.groupSubscribeButton.accept" /> : getStatus()}
    </Root>
  );
}
