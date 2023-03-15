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
        components: {
          MuiPaper: {
            // styleOverrides: {
            //   rounded: {
            //     borderRadius: 3,
            //   },
            // },
          },
          SCWidget: {
            // variants: [
            //   {
            //     props: {elevation: 0},
            //     style: {
            //       border: 0,
            //       boxShadow: 'none',
            //       marginBottom: '0 !important',
            //     },
            //   },
            //   {
            //     props: {variant: 'outlined'},
            //     style: {
            //       border: '1px solid rgba(0, 0, 0, 0.12)',
            //       boxShadow: 'none',
            //     },
            //   },
            // ],
            // styleOverrides: {
            //   root: {
            //     border: '0 none',
            //     boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.1)',
            //     borderRadius: '15px',
            //   },
            // },
          },
          SCNotificationItem: {
            // styleOverrides: {
            //   root: {
            //     '&.SCNotificationItem-new-snippet': {
            //       '&::before': {
            //         backgroundColor: 'yellow',
            //       },
            //     },
            //   },
            // },
          },
          SCSnippetNotifications: {
            styleOverrides: {
              root: {
                '& .SCSnippetNotifications-list': {
                  // wrap notifications list (ul)
                },
                '& .SCSnippetNotifications-item': {
                  // single notification item (li)
                },
                ['& .SCUserFollowNotification-username, .SCUserFollowNotification-username, .SCCommentNotification-username,' +
                'SCContributionFollowNotification-username, .SCContributionFollowNotification-username, .SCUserNotificationMention-username,' +
                '.SCUserNotificationMention-username, .SCUserNotificationPrivateMessage-message-sender, .SCVoteUpNotification-username']: {
                  // username for notification types: user follow, comment/nested comment,
                  // follow contribution, mention, private message, vote up
                },
                ['& .SCUserFollowNotification-list-item-snippet-new, .SCVoteUpNotification-list-item-snippet-new, ' +
                '.SCUserBlockedNotification-list-item-snippet-new, .SCUndeletedForNotification-list-item-snippet-new, ' +
                '.SCUserNotificationPrivateMessage-list-item-snippet-new, .SCUserNotificationMention-list-item-snippet-new,' +
                '.SCKindlyNoticeForNotification-list-item-snippet-new, .SCKindlyNoticeFlagNotification-list-item-snippet-new,' +
                '.SCIncubatorApprovedNotification-list-item-snippet-new, .SCDeletedForNotification-list-item-snippet-new,' +
                '.SCContributionFollowNotification-list-item-snippet-new, .SCCommentNotification-list-item-snippet-new,' +
                '.SCCollapsedForNotification-list-item-snippet-new']: {
                  // border left indicate new notification of various type
                },
              },
            },
          },
        },
      }
    : {};
  console.log(options);
  return createTheme(mergeDeep({selfcommunity, ...defaultOptions}, options)) as SCThemeType;
};

export default getTheme;
