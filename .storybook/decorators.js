import React from "react";
import SCContextProvider from '../packages/sc-core/src/components/provider/SCContextProvider'

const withProvider = (Story, context) => {
  const _settings = {
    portal: context.globals.portal,
    locale: context.globals.locale,
    session: {
      type: context.globals.session,
      token: context.globals.authToken,
      refreshToken: context.globals.authToken,
      refreshTokenEndpoint: context.globals.authRefreshTokenEndpoint
    },
  };
  return (
    <SCContextProvider settings={_settings}><Story {...context}/></SCContextProvider>
  );
};

export default {
  withProvider
};






