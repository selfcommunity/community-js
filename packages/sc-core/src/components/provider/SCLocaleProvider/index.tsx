import React, {createContext, useContext, useMemo, useState} from 'react';
import {SCContextType} from '../../../types';
import {useSCContext} from '../SCContextProvider';
import {SCLocaleContextType} from '../../../types';
import {loadLocaleData} from '../../../utils/locale';
import {DEFAULT_LANGUAGE_UI} from '../../../constants/Locale';
import {IntlProvider} from 'react-intl';
import {Logger} from '../../../utils/logger';
import {SCOPE_SC_CORE} from '../../../constants/Errors';

/**
 * Creates Global Context
 *
 :::tipContext can be consumed in one of the following ways:

 ```jsx
 1. <SCLocaleContext.Consumer>{(locale,) => (...)}</SCLocaleContext.Consumer>
 ```
 ```jsx
 2. const scLocaleContext: SCLocaleContextType = useContext(SCLocaleContext);
 ```
 ```jsx
 3. const scLocaleContext: SCLocaleContextType = useSCLocale();
 ````
 :::
 */
export const SCLocaleContext = createContext<SCLocaleContextType>({} as SCLocaleContextType);

/**
 * This component makes the `intl` available down the React tree.
 */
export default function SCLocaleProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const initialLocale: string = scContext.settings.locale?.default ? scContext.settings.locale.default : DEFAULT_LANGUAGE_UI;
  const initial = loadLocaleData(initialLocale, scContext.settings);
  const [locale, setLocale] = useState(initial.locale);
  const [messages, setMessages] = useState(initial.messages);

  const updateLocale = (_intl) => {
    setLocale(_intl.locale);
    setMessages(_intl.messages);
  };

  const selectLocale = useMemo(
    () => (l) => {
      const {messages, locale} = loadLocaleData(l, scContext.settings);
      updateLocale({messages, locale});
    },
    [locale]
  );

  /**
   * handleIntlError
   * @param error
   */
  const handleIntlError = (error) => {
    if (error.code === 'MISSING_TRANSLATION') {
      Logger.warn(SCOPE_SC_CORE, `Missing translation: ${error.message}`);
      return;
    }
    throw error;
  };

  return (
    <SCLocaleContext.Provider value={{locale, messages, selectLocale}}>
      <IntlProvider key={locale} locale={locale} messages={messages} onError={handleIntlError}>
        {children}
      </IntlProvider>
    </SCLocaleContext.Provider>
  );
}

/**
 * Export hoc to inject the base theme to components
 * @param Component
 */
export const withSCLocale = (Component) => (props) => {
  const scLocaleContext: SCLocaleContextType = useContext(SCLocaleContext);
  return (
    <IntlProvider locale={scLocaleContext.locale} messages={scLocaleContext.messages}>
      <Component setLanguage={scLocaleContext.selectLocale} {...props} />
    </IntlProvider>
  );
};

/**
 * Let's only export the `useSCLocale` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCLocale(): SCLocaleContextType {
  return useContext(SCLocaleContext);
}
