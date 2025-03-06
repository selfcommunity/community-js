import {useMemo} from 'react';
import {SCFeatureName} from '@selfcommunity/types';
import {useSCPreferences} from '../components/provider/SCPreferencesProvider';
import * as SCPreferences from '../constants/Preferences';
import {SCPreferencesContextType} from '../types';
/**
 :::info
 This custom hook is used to check if the payments are enabled
 :::
 :::tip How to use it:

 Follow these steps:
 ```jsx
 1. import useSCPaymentsEnabled from '@selfcommunity/react-core';
 2.	const {isPaymentsEnabled, stripePublicKey, stripeConnectedAccountId} = useSCPaymentsEnabled();
 ```
 :::
 */
export default function useSCPaymentsEnabled() {
  // CONTEXT
  const {preferences, features}: SCPreferencesContextType = useSCPreferences();

  const isPaymentsEnabled = useMemo(
    () =>
      preferences &&
      features &&
      features.includes(SCFeatureName.PAYMENTS) &&
      SCPreferences.CONFIGURATIONS_PAYMENTS_ENABLED in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_PAYMENTS_ENABLED].value,
    [preferences]
  );
  const stripePublicKey = useMemo(
    () => preferences && SCPreferences.STATIC_STRIPE_PUBLIC_KEY in preferences && preferences[SCPreferences.STATIC_STRIPE_PUBLIC_KEY].value,
    [preferences]
  );
  const stripeConnectedAccountId = useMemo(
    () =>
      preferences &&
      SCPreferences.CONFIGURATIONS_STRIPE_CONNECTED_ACCOUNT_ID in preferences &&
      preferences[SCPreferences.CONFIGURATIONS_STRIPE_CONNECTED_ACCOUNT_ID].value,
    [preferences]
  );

  return {isPaymentsEnabled, stripePublicKey, stripeConnectedAccountId};
}
