import {useEffect, useMemo, useState} from 'react';
import {Button, styled} from '@mui/material';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCSubscribedGroupsManagerType,
  SCUserContextType,
  useSCContext,
  useSCFetchGroup,
  useSCPaymentsEnabled,
  useSCUser
} from '@selfcommunity/react-core';
import {SCContentType, SCGroupPrivacyType, SCGroupSubscriptionStatusType, SCGroupType, SCUserType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';
import BuyButton from '../BuyButton';

const PREFIX = 'SCGroupSubscribeButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

const BuyButtonRoot = styled(BuyButton, {
  name: PREFIX,
  slot: 'BuyButtonRoot'
})(({theme}) => ({
  marginTop: theme.spacing()
}));

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
   * onSubscribe callback
   * @param group
   * @param status
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

  const {className, groupId, group, onSubscribe, ...rest} = props;

  // STATE
  const [status, setStatus] = useState<string>(null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scGroupsManager: SCSubscribedGroupsManagerType = scUserContext.managers.groups;

  // PAYMENTS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

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
  }, [authUserId, scGroupsManager.subscriptionStatus, scGroup]);

  /**
   * Define if the buyButton is visible
   */
  const showBuyButton =
    !isGroupAdmin &&
    isPaymentsEnabled &&
    scGroup.paywalls?.length > 0 &&
    (scGroup.privacy === SCGroupPrivacyType.PUBLIC ||
      (scGroup.privacy === SCGroupPrivacyType.PRIVATE && status && status !== SCGroupSubscriptionStatusType.REQUESTED));

  /**
   * Notify UI when a member is added to a group
   * @param group
   * @param user
   */
  function notifyChanges(group: SCGroupType, user: SCUserType) {
    if (group && user) {
      PubSub.publish(`${SCTopicType.GROUP}.${SCGroupEventType.ADD_MEMBER}`, {group, user});
    }
  }

  const subscribe = () => {
    scGroupsManager
      .subscribe(scGroup)
      .then(() => {
        const _status =
          scGroup.privacy === SCGroupPrivacyType.PRIVATE && scGroup.subscription_status !== SCGroupSubscriptionStatusType.INVITED
            ? SCGroupSubscriptionStatusType.REQUESTED
            : SCGroupSubscriptionStatusType.SUBSCRIBED;
        if (_status === SCGroupSubscriptionStatusType.SUBSCRIBED) {
          notifyChanges(scGroup, scUserContext.user);
        }
        onSubscribe && onSubscribe(scGroup, _status);
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
      status === SCGroupSubscriptionStatusType.SUBSCRIBED ? unsubscribe() : subscribe();
    }
  };

  /**
   * Get current translated status
   */
  const getStatus = useMemo((): JSX.Element => {
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
  }, [status, scGroup]);

  if (!scGroup || isGroupAdmin) {
    return null;
  }

  if (showBuyButton) {
    return <BuyButtonRoot contentType={SCContentType.GROUP} content={scGroup} />;
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
      {getStatus}
    </Root>
  );
}
