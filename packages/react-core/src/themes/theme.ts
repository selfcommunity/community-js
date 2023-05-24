import {createTheme} from '@mui/material/styles';
import {mergeDeep} from '@selfcommunity/utils';
import validateColor from 'validate-color';
import {
  COLORS_COLORBACK,
  COLORS_COLORPRIMARY,
  COLORS_COLORSECONDARY,
  COLORS_COLORFONT,
  COLORS_NAVBARBACK,
  STYLE_FONT_FAMILY,
} from '../constants/Preferences';
import {isString} from '@selfcommunity/utils';
import {SCThemeVariablesType, SCThemeType} from '../types';

/**
 * check if colorProp is a valid color
 * @param preferences
 * @param colorProp
 * @param tFunc: type func validator
 * @return {boolean|(function(*=): boolean)}
 */
const isValidPreference = (preferences, prop, tFunc) => {
  // eslint-disable-next-line no-prototype-builtins
  if (preferences.hasOwnProperty(prop) && preferences[prop].hasOwnProperty('value')) {
    return tFunc(preferences[prop].value);
  }
  return false;
};

/**
 * Overrides theme properties
 * @param options: store.settings.theme
 * @param preferences: community global preferences
 * @return {SCThemeType}
 */
const getTheme = (options, preferences): SCThemeType => {
  const selfcommunity: SCThemeVariablesType = {
    user: {
      avatar: {
        sizeSmall: 24,
        sizeMedium: 40,
        sizeLarge: 50,
        sizeXLarge: 100,
      },
    },
    category: {
      icon: {
        sizeSmall: 24,
        sizeMedium: 40,
        sizeLarge: 50,
      },
    },
  };
  const defaultOptions = preferences
    ? {
        palette: {
          ...(isValidPreference(preferences, COLORS_COLORBACK, validateColor) && {background: {default: preferences[COLORS_COLORBACK].value}}),
          ...(isValidPreference(preferences, COLORS_COLORFONT, validateColor) && {text: {primary: preferences[COLORS_COLORFONT].value}}),
          ...(isValidPreference(preferences, COLORS_COLORPRIMARY, validateColor) && {primary: {main: preferences[COLORS_COLORPRIMARY].value}}),
          ...(isValidPreference(preferences, COLORS_COLORSECONDARY, validateColor) && {
            secondary: {main: preferences[COLORS_COLORSECONDARY].value},
            ...(isValidPreference(preferences, COLORS_NAVBARBACK, validateColor) && {navbar: {main: preferences[COLORS_NAVBARBACK].value}}),
          }),
        },
        typography: {
          ...(isValidPreference(preferences, STYLE_FONT_FAMILY, isString) && {fontFamily: preferences[STYLE_FONT_FAMILY].value}),
        },
      }
    : {};
  return createTheme(mergeDeep({selfcommunity, ...defaultOptions}, options)) as SCThemeType;
};

export default getTheme;
