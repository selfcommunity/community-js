import {
  Link,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  useSCPreferences,
  useSCRouting
} from '@selfcommunity/react-core';
import React, {useMemo} from 'react';

export default function DefaultHeaderContent() {
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const _logo = useMemo(() => {
    return SCPreferences.LOGO_NAVBAR_LOGO in scPreferences.preferences ? scPreferences.preferences[SCPreferences.LOGO_NAVBAR_LOGO].value : null;
  }, [scPreferences.preferences]);

  return (
    <Link to={scRoutingContext.url(SCRoutes.HOME_ROUTE_NAME, {})}>
      <img src={_logo} alt="logo"></img>
    </Link>
  );
}
