import React, {createContext, useContext, useMemo, useRef, useState} from 'react';
import {SCContextType} from '../../../types';
import {useSCContext} from '../SCContextProvider';
import {SCLocaleContextType} from '../../../types';
import newIntl, {loadLocaleData} from '../../../utils/locale';
import {DEFAULT_LANGUAGE_UI, LOCALE_EN, LOCALE_IT} from '../../../constants/Locale';
import {createIntlCache, IntlProvider} from 'react-intl';

/**
 * Create Global Context
 * Consuming this context:
 *  1. <SCLocaleContext.Consumer>
 *       {(locale,) => (...)}
 *     </SCLocaleContext.Consumer>
 *  2. const SCLocaleContext: SCLocaleContextType = useContext(SCLocaleContext);
 */
export const SCLocaleContext = createContext<SCLocaleContextType>({} as SCLocaleContextType);

/**
 * This component makes the `intl` available down the React tree.
 */
export default function SCLocaleProvider({children = null}: {children: React.ReactNode}): JSX.Element {
  const scContext: SCContextType = useSCContext();
  const initialLocale: string = scContext.settings.locale ? scContext.settings.locale : DEFAULT_LANGUAGE_UI;
  let intl = useRef(
    newIntl(
      {
        locale: initialLocale,
        defaultLocale: DEFAULT_LANGUAGE_UI,
        messages: loadLocaleData(initialLocale),
      },
      createIntlCache()
    )
  );
  const [locale, setLocale] = useState(intl.current.locale);
  const [messages, setMessages] = useState(intl.current.messages);

  const updateLocale = (_intl) => {
    intl.current = _intl;
    setLocale(_intl.locale);
    setMessages(_intl.messages);
  };

  const selectLocale = useMemo(
    () => (locale) => {
      const cache = createIntlCache();
      let _intl;
      switch (locale) {
        case LOCALE_EN:
          _intl = newIntl(
            {
              locale: LOCALE_EN,
              defaultLocale: DEFAULT_LANGUAGE_UI,
              messages: loadLocaleData(LOCALE_EN),
            },
            cache
          );
          break;
        case LOCALE_IT:
          _intl = newIntl(
            {
              locale: LOCALE_IT,
              defaultLocale: DEFAULT_LANGUAGE_UI,
              messages: loadLocaleData(LOCALE_IT),
            },
            cache
          );
          break;
        default:
          _intl = newIntl(
            {
              locale: LOCALE_EN,
              defaultLocale: DEFAULT_LANGUAGE_UI,
              messages: loadLocaleData(LOCALE_EN),
            },
            cache
          );
          break;
      }
      updateLocale(_intl);
    },
    [locale]
  );

  /**
   * handleIntlError
   * @param error
   */
  const handleIntlError = (error) => {
    if (error.code === 'MISSING_TRANSLATION') {
      console.warn('Missing translation', error.message);
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
 * Let's only export the `useSCTheme` hook instead of the context.
 * We only want to use the hook directly and never the context component.
 */
export function useSCLocale(): SCLocaleContextType {
  return useContext(SCLocaleContext);
}
