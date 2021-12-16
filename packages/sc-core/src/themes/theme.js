import {createTheme} from '@mui/material/styles';
import {mergeDeep} from '../utils/object';
import validateColor from 'validate-color';
import {COLORS_COLORBACK, COLORS_COLORPRIMARY, COLORS_COLORSECONDARY, FONT_FAMILY} from '../constants/Preferences';
import {isString} from '../utils/string';

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
 * Override theme properties
 * @param options: store.settings.theme
 * @param preferences: community global preferences
 * @return {Theme}
 */
const getTheme = (options, preferences) => {
  const defaultOptions = preferences
    ? {
        palette: {
          ...(isValidPreference(preferences, COLORS_COLORBACK, validateColor) && {background: {default: preferences[COLORS_COLORBACK].value}}),
          ...(isValidPreference(preferences, COLORS_COLORPRIMARY, validateColor) && {text: {primary: preferences[COLORS_COLORPRIMARY].value}}),
          ...(isValidPreference(preferences, COLORS_COLORPRIMARY, validateColor) && {primary: {main: preferences[COLORS_COLORPRIMARY].value}}),
          ...(isValidPreference(preferences, COLORS_COLORSECONDARY, validateColor) && {
            secondary: {main: preferences[COLORS_COLORSECONDARY].value},
          }),
        },
        typography: {
          ...(isValidPreference(preferences, FONT_FAMILY, isString) && {fontFamily: preferences[FONT_FAMILY].value}),
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
                borderRadius: 3,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
            variants: [
              {
                props: {variant: 'outlined'},
                style: {
                  border: `1px solid black`,
                  color: 'black',
                },
              },
            ],
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderWidth: '1px',
              },
            },
          },
          SCFeedObject: {
            styleOverrides: {
              root: {},
            },
          },
          SCTrendingFeed: {
            styleOverrides: {
              root: {
                '& .MuiSvgIcon-root': {
                  width: '0.7em',
                  marginBottom: '0.5px',
                },
              },
            },
          },
          SCPlatform: {
            styleOverrides: {
              root: {
                '& .MuiSvgIcon-root': {
                  width: '0.8em',
                  marginLeft: '2px',
                  marginBottom: '-3px',
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
