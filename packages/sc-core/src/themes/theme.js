import {createTheme} from '@mui/material/styles';
import {mergeDeep} from '../utils/object';
import t from 'typy';
import {COLORS_COLORBACK, COLORS_COLORPRIMARY, COLORS_COLORSECONDARY, FONT_FAMILY} from '../constants/Preferences';

/**
 * check if colorProp is a valid color
 * @param preferences
 * @param colorProp
 * @param tFunc: type func validator
 * @return {boolean|(function(*=): boolean)}
 */
const isValidPreference = (preferences, colorProp, tFunc) => {
  // eslint-disable-next-line no-prototype-builtins
  if (preferences.hasOwnProperty(colorProp) && preferences[colorProp].hasOwnProperty('value')) {
    return t(preferences[colorProp].value)[tFunc];
  }
  return false;
};

/**
 * Override theme properties
 * @param options: store.settings.theme
 * @param preferences: community global preferences
 * @return {Theme}
 */
const getTheme = (options, preferences) => {
  const defaultOptions = preferences
    ? {
        palette: {
          ...(isValidPreference(preferences, COLORS_COLORBACK, 'isColor') && {background: {default: preferences[COLORS_COLORBACK].value}}),
          ...(isValidPreference(preferences, COLORS_COLORPRIMARY, 'isColor') && {text: {primary: preferences[COLORS_COLORPRIMARY].value}}),
          ...(isValidPreference(preferences, COLORS_COLORPRIMARY, 'isColor') && {primary: {main: preferences[COLORS_COLORPRIMARY].value}}),
          ...(isValidPreference(preferences, COLORS_COLORSECONDARY, 'isColor') && {secondary: {main: preferences[COLORS_COLORSECONDARY].value}}),
        },
        typography: {
          ...(isValidPreference(preferences, FONT_FAMILY, 'isString') && {fontFamily: preferences[FONT_FAMILY].value}),
          body1: {
            fontSize: '0.9rem',
          },
          body2: {
            fontSize: '0.8rem',
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 10,
              },
            },
          },
          SCFeedObject: {
            styleOverrides: {
              root: {
                '& .SCFeedObject-category': {
                  backgroundColor: '#FF0000',
                  borderColor: '#FF0000',
                },
              },
            },
          },
        },
      }
    : {};
  return createTheme(mergeDeep(defaultOptions, options));
};

export default getTheme;
