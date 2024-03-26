import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {SCContextType, SCSubscribedGroupsManagerType, SCUserContextType, useSCContext, useSCFetchGroup, useSCUser} from '@selfcommunity/react-core';
import {SCGroupPrivacyType, SCGroupSubscriptionStatusType, SCGroupType} from '@selfcommunity/types';
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
   * onJoin callback
   * @param user
   * @param joined
   */
  onJoin?: (group: SCGroupType, member: boolean) => any;

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

  const {className, groupId, group, onJoin, ...rest} = props;

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

  useEffect(() => {
    /**
     * Call scGroupsManager.subscriptionStatus inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setStatus(scGroupsManager.subscriptionStatus(scGroup));
    }
  }, [authUserId, scGroupsManager.subscriptionStatus]);

  const subscribe = () => {
    scGroupsManager
      .subscribe(scGroup)
      .then(() => {
        // onJoin && onJoin(scGroup, !joined);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const unsubscribe = () => {
    scGroupsManager
      .unsubscribe(scGroup)
      .then(() => {
        // onJoin && onJoin(scGroup, !joined);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleSubscribeAction = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      SCGroupSubscriptionStatusType.SUBSCRIBED ? unsubscribe() : subscribe();
    }
  };

  /**
   * Get current translated status
   */
  const getStatus = (): JSX.Element => {
    let _status;
    switch (status) {
      case SCGroupSubscriptionStatusType.REQUESTED:
        _status = <FormattedMessage defaultMessage="ui.groupJoinButton.waitingApproval" id="ui.groupJoinButton.waitingApproval" />;
        break;
      case SCGroupSubscriptionStatusType.SUBSCRIBED:
        _status = <FormattedMessage defaultMessage="ui.groupSubscribeButton.exit" id="ui.groupSubscribeButton.exit" />;
        break;
      default:
        scGroup.privacy === SCGroupPrivacyType.PUBLIC
          ? (_status = <FormattedMessage defaultMessage="ui.groupSubscribeButton.enter" id="ui.groupSubscribeButton.enter" />)
          : (_status = <FormattedMessage defaultMessage="ui.groupJoinButton.requestAccess" id="ui.groupJoinButton.requestAccess" />);
        break;
    }
    return _status;
  };

  if (!scGroup || (scGroup && !scGroup.subscription_status)) {
    return null;
  }

  return (
    <Root
      size="small"
      variant="outlined"
      onClick={handleSubscribeAction}
      loading={scUserContext.user ? scGroupsManager.isLoading(scGroup) : null}
      className={classNames(classes.root, className)}
      {...rest}>
      {getStatus()}
    </Root>
  );
}
