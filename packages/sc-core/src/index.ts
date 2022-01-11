/**
 * Types
 */
import {
  SCContextType,
  SCAuthTokenType,
  SCUserContextType,
  SCFollowedManagerType,
  SCConnectionsManagerType,
  SCCategoriesManagerType,
  SCContextProviderType,
  SCCustomAdvPosition,
  SCCustomAdvType,
  SCSettingsType,
  SCSessionType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCPreferencesContextType,
  SCUserType,
  SCTagType,
  SCCategoryType,
  SCEmbedType,
  SCMediaType,
  SCContributeLocation,
  SCLocalityType,
  SCPollChoiceType,
  SCPollType,
  SCFeedUnitType,
  SCFeedUnitActivityType,
  SCFeedObjectType,
  SCFeedPostType,
  SCFeedDiscussionType,
  SCFeedStatusType,
  SCFeedObjectTypologyType,
  SCFeedUnitActivityTypologyType,
  SCFeedTypologyType,
  SCCommentTypologyType,
  SCCommentType,
  SCPrivateMessageType,
  SCPrivateMessageStatusType,
  SCNotificationTypologyType,
  SCNotificationAggregatedType,
  SCNotificationCommentType,
  SCNotificationConnectionAcceptType,
  SCNotificationConnectionRequestType,
  SCNotificationPrivateMessageType,
  SCNotificationMentionType,
  SCNotificationType,
  SCNotificationBlockedUserType,
  SCNotificationCollapsedForType,
  SCNotificationCustomNotificationType,
  SCNotificationDeletedForType,
  SCNotificationFollowType,
  SCNotificationKindlyNoticeType,
  SCNotificationUnBlockedUserType,
  SCNotificationUnDeletedForType,
  SCNotificationUserFollowType,
  SCNotificationVoteUpType,
  SCCustomNotificationType,
} from './types';

/**
 * ContextProvider component
 */
import SCContextProvider, {SCContext, useSCContext} from './components/provider/SCContextProvider';

/**
 * AuthProvider component
 */
import SCUserProvider, {SCUserContext, useSCUser} from './components/provider/SCUserProvider';

/**
 * ThemeProvider component
 */
import SCThemeProvider, {SCThemeContext, useSCTheme, withSCTheme} from './components/provider/SCThemeProvider';

/**
 * RoutingProvider component
 */
import SCRoutingProvider, {SCRoutingContext, useSCRouting} from './components/provider/SCRoutingProvider';

/**
 * LocaleProvider component
 */
import SCLocaleProvider, {SCLocaleContext, useSCLocale, withSCLocale} from './components/provider/SCLocaleProvider';

/**
 * PreferencesProvider component
 */
import SCPreferencesProvider, {SCPreferencesContext, useSCPreferences} from './components/provider/SCPreferencesProvider';
import * as SCPreferences from './constants/Preferences';
import * as SCFeatures from './constants/Features';

/**
 * Custom Hooks
 */
import useSCFetchUser from './hooks/useSCFetchUser';
import useSCFetchFeedObject from './hooks/useSCFetchFeedObject';
import useSCFetchCommentObject from './hooks/useSCFetchCommentObject';
import useSCFetchCustomAdv from './hooks/useSCFetchCustomAdv';
import useSCFetchTag from './hooks/useSCFetchTag';
import useSCFetchCategory from './hooks/useSCFetchCategory';

/**
 * Routing component
 */
import Link from './components/router';
import * as SCRoutes from './constants/Routes';

/**
 * Http component
 */
import http, {formatHttpError} from './utils/http';

/**
 * Endpoint component
 */
import Endpoints from './constants/Endpoints';

/**
 * Utilities:
 * logger, string, url, object
 */
import {Logger} from './utils/logger';
import * as StringUtils from './utils/string';
import * as ObjectUtils from './utils/object';
import * as UrlUtils from './utils/url';

/**
 * Constants:
 * Locale
 */
import * as Locale from './constants/Locale';

/**
 * List all exports
 */
export {
  SCContextProviderType,
  SCCustomAdvPosition,
  SCCustomAdvType,
  SCSettingsType,
  SCAuthTokenType,
  SCSessionType,
  SCContextType,
  SCUserContextType,
  SCFollowedManagerType,
  SCConnectionsManagerType,
  SCCategoriesManagerType,
  SCThemeContextType,
  SCRoutingContextType,
  SCLocaleContextType,
  SCPreferencesContextType,
  SCUserType,
  SCTagType,
  SCCategoryType,
  SCEmbedType,
  SCMediaType,
  SCContributeLocation,
  SCLocalityType,
  SCPollChoiceType,
  SCPollType,
  SCFeedUnitType,
  SCFeedUnitActivityType,
  SCFeedObjectType,
  SCFeedPostType,
  SCFeedDiscussionType,
  SCFeedStatusType,
  SCFeedObjectTypologyType,
  SCFeedUnitActivityTypologyType,
  SCFeedTypologyType,
  SCCommentTypologyType,
  SCCommentType,
  SCPrivateMessageType,
  SCPrivateMessageStatusType,
  SCNotificationTypologyType,
  SCNotificationAggregatedType,
  SCNotificationCommentType,
  SCNotificationConnectionAcceptType,
  SCNotificationConnectionRequestType,
  SCNotificationPrivateMessageType,
  SCNotificationMentionType,
  SCNotificationType,
  SCNotificationBlockedUserType,
  SCNotificationCollapsedForType,
  SCNotificationCustomNotificationType,
  SCNotificationDeletedForType,
  SCNotificationFollowType,
  SCNotificationKindlyNoticeType,
  SCNotificationUnBlockedUserType,
  SCNotificationUnDeletedForType,
  SCNotificationUserFollowType,
  SCNotificationVoteUpType,
  SCCustomNotificationType,
  SCContext,
  SCUserContext,
  SCThemeContext,
  SCRoutingContext,
  SCLocaleContext,
  SCPreferencesContext,
  useSCContext,
  SCContextProvider,
  SCUserProvider,
  useSCUser,
  useSCPreferences,
  SCThemeProvider,
  useSCTheme,
  withSCTheme,
  SCRoutingProvider,
  useSCRouting,
  SCLocaleProvider,
  useSCLocale,
  withSCLocale,
  SCPreferencesProvider,
  SCPreferences,
  SCFeatures,
  http,
  formatHttpError,
  Link,
  SCRoutes,
  Endpoints,
  Logger,
  StringUtils,
  ObjectUtils,
  UrlUtils,
  Locale,
  useSCFetchUser,
  useSCFetchFeedObject,
  useSCFetchCommentObject,
  useSCFetchCustomAdv,
  useSCFetchTag,
  useSCFetchCategory,
};
