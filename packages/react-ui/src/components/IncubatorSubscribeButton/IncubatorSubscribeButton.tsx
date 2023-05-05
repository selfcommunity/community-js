import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import {SCIncubatorType} from '@selfcommunity/types';
import {CacheStrategies, Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCSubscribedIncubatorsManagerType,
  SCUserContextType,
  useSCContext,
  useSCFetchIncubator,
  useSCUser
} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCIncubatorSubscribeButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface IncubatorSubscribeButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Id of the incubator
   * @default null
   */
  incubatorId?: number;

  /**
   * Incubator
   * @default null
   */
  incubator?: SCIncubatorType;

  /**
   * onSubscribe callback
   * @param incubator
   * @param subscribed
   */
  onSubscribe?: (incubator: SCIncubatorType, subscribed: boolean) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Incubator Subscribe Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {IncubatorSubscribeButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCIncubatorSubscribeButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCIncubatorSubscribeButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function IncubatorSubscribeButton(inProps: IncubatorSubscribeButtonProps): JSX.Element {
  // PROPS
  const props: IncubatorSubscribeButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, incubatorId, incubator, onSubscribe, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scSubscribedIncubatorsManager: SCSubscribedIncubatorsManagerType = scUserContext.managers.incubators;
  const authUserId = scUserContext.user ? scUserContext.user.id : null;
  // STATE
  const {scIncubator, setSCIncubator} = useSCFetchIncubator({
    id: incubatorId,
    incubator,
    cacheStrategy: authUserId ? CacheStrategies.CACHE_FIRST : CacheStrategies.STALE_WHILE_REVALIDATE
  });
  const [subscribed, setSubscribed] = useState<boolean>(null);

  useEffect(() => {
    /**
     * Call scFollowedIncubatorsManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (authUserId) {
      setSubscribed(scSubscribedIncubatorsManager.isSubscribed(scIncubator));
    }
  }, [authUserId, scSubscribedIncubatorsManager.isSubscribed]);

  const subscribe = () => {
    scSubscribedIncubatorsManager
      .subscribe(scIncubator)
      .then(() => {
        onSubscribe && onSubscribe(scIncubator, !subscribed);
      })
      .catch((e) => {
        Logger.error(SCOPE_SC_UI, e);
      });
  };

  const handleSubscribeAction = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      subscribe();
    }
  };

  return (
    <Root
      size="small"
      variant={subscribed ? 'contained' : 'outlined'}
      onClick={handleSubscribeAction}
      loading={scUserContext.user ? subscribed === null || scSubscribedIncubatorsManager.isLoading(scIncubator) : null}
      className={classNames(classes.root, className)}
      {...rest}>
      {subscribed && scUserContext.user ? (
        <FormattedMessage defaultMessage="ui.incubator.subscribeButton.button.subscribed" id="ui.incubator.subscribeButton.button.subscribed" />
      ) : (
        <FormattedMessage defaultMessage="ui.incubator.subscribeButton.button.subscribe" id="ui.incubator.subscribeButton.button.subscribe" />
      )}
    </Root>
  );
}
