import React from "react";
import SCContextProvider from '../packages/sc-core/src/components/provider/SCContextProvider'

const withProvider = (Story, context) => {
  const _settings = {
    portal: context.globals.portal,
    locale: context.globals.locale,
    session: {
      type: context.globals.session,
      authToken: context.globals.authToken,
      isRefreshing: false,
      refreshTokenEndpoint: {
        path: context.globals.authRefreshTokenEndpoint.path,
        method: context.globals.authRefreshTokenEndpoint.method
      }
    },
  };
  return (
    <SCContextProvider settings={_settings}><Story {...context}/></SCContextProvider>
  );
};

export default {
  withProvider
};






