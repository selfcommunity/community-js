import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, CircularProgress} from '@mui/material';
import {Logger} from '@selfcommunity/utils';
import {SCPaymentsCustomerPortalSession} from '@selfcommunity/types';
import {SCUserContextType, useSCPaymentsEnabled, useSCUser} from '@selfcommunity/react-core';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {PREFIX} from './constants';
import {PaymentApiClient} from '@selfcommunity/api-services';

const classes = {
  root: `${PREFIX}-root`,
  field: `${PREFIX}-field`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root'
})(() => ({}));

export interface UserPaymentMethodsProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Handle customer portal callback
   * @param url
   */
  onHandleCustomerPortal?: (url) => void;

  /**
   * Return url
   * @default null
   */
  returnUrl?: string;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS User Payment Methods. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserPaymentMethods} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserPaymentMethods` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserPaymentMethods-root|Styles applied to the root element.|

 * @param inProps
 */
export default function UserPaymentMethods(inProps: UserPaymentMethodsProps): JSX.Element {
  // PROPS
  const props: UserPaymentMethodsProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = null, onHandleCustomerPortal, returnUrl, ...rest} = props;

  // STATE
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HOOKS
  const {isPaymentsEnabled} = useSCPaymentsEnabled();

  /**
   * Handle view new object purchased
   */
  const handleCustomerPortal = useCallback(
    (redirectUrl: string) => {
      if (onHandleCustomerPortal) {
        onHandleCustomerPortal(redirectUrl);
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },
    [onHandleCustomerPortal]
  );

  /**
   * Initialize component
   * Fetch data only if the component is not initialized, and it is not loading data
   */
  const _initComponent = useMemo(
    () => (): void => {
      if (!initialized && !isLoading) {
        setInitialized(true);
        setIsLoading(true);
        PaymentApiClient.getPaymentsCustomerPortal({...(returnUrl && {return_url: returnUrl})})
          .then((portalSession: SCPaymentsCustomerPortalSession) => {
            if (portalSession.url) {
              handleCustomerPortal(portalSession.url);
            }
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    },
    [isLoading, initialized]
  );

  // EFFECTS
  useEffect(() => {
    let _t;
    if (scUserContext.user && !initialized) {
      _t = setTimeout(_initComponent);
      return (): void => {
        _t && clearTimeout(_t);
      };
    }
  }, [scUserContext.user, initialized]);

  if (!isPaymentsEnabled) {
    return null;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {(!scUserContext.user || isLoading) && <CircularProgress />}
    </Root>
  );
}
