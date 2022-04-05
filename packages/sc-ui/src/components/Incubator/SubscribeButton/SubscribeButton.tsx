import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {LoadingButton} from '@mui/lab';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import classNames from 'classnames';
import {
  Logger,
  SCContextType,
  SCSubscribedIncubatorsManagerType,
  SCIncubatorType,
  SCUserContext,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchIncubator
} from '@selfcommunity/core';
import {useSnackbar} from 'notistack';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCSubscribeButton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: 8
}));

export interface SubscribeButtonProps {
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
  incubator: SCIncubatorType;

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
 * > API documentation for the Community-UI Subscribe Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SubscribeButton} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCSubscribeButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSubscribeButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function SubscribeButton(inProps: SubscribeButtonProps): JSX.Element {
  // PROPS
  const props: SubscribeButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, incubatorId, incubator, onSubscribe, ...rest} = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scSubscribedIncubatorsManager: SCSubscribedIncubatorsManagerType = scUserContext.managers.incubators;

  // STATE
  const {scIncubator, setSCIncubator} = useSCFetchIncubator({id: incubatorId, incubator});
  const [subscribed, setSubscribed] = useState<boolean>(null);
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    /**
     * Call scFollowedIncubatorsManager.isFollowed inside an effect
     * to avoid warning rendering child during update parent state
     */
    if (scUserContext.user) {
      setSubscribed(scSubscribedIncubatorsManager.isSubscribed(scIncubator));
    }
  });

  const subscribe = () => {
    if (!subscribed && UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning'
      });
    } else {
      scSubscribedIncubatorsManager
        .subscribe(scIncubator)
        .then(() => {
          onSubscribe && onSubscribe(scIncubator, !subscribed);
        })
        .catch((e) => {
          Logger.error(SCOPE_SC_UI, e);
        });
    }
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
      {subscribed ? (
        <>
          <Icon>check</Icon>
          <FormattedMessage defaultMessage="ui.incubator.subscribeButton.button.subscribed" id="ui.incubator.subscribeButton.button.subscribed" />
        </>
      ) : (
        <FormattedMessage defaultMessage="ui.incubator.subscribeButton.button.subscribe" id="ui.incubator.subscribeButton.button.subscribe" />
      )}
    </Root>
  );
}
