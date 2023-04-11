import {SCPreferenceName, SCPreferenceSection} from '@selfcommunity/types';

/**
 * DEFAULT CONF VALIDATION OPTION
 */
export const PREFERENCES_OPTION = 'preferences';
export const GLOBAL_PREFERENCES_OPTION = 'preferences';
export const DEFAULT_GLOBAL_PREFERENCES_OPTION = {};

/** PREFERENCES */

/**
 * TEXT
 */
export const TEXT_APPLICATION_NAME = `${SCPreferenceSection.TEXT}.${SCPreferenceName.APPLICATION_NAME}`;
export const TEXT_APPLICATION_SLOGAN1 = `${SCPreferenceSection.TEXT}.${SCPreferenceName.APPLICATION_SLOGAN1}`;
export const TEXT_APPLICATION_SLOGAN2 = `${SCPreferenceSection.TEXT}.${SCPreferenceName.APPLICATION_SLOGAN2}`;
export const TEXT_APPLICATION_COPYRIGHT = `${SCPreferenceSection.TEXT}.${SCPreferenceName.APPLICATION_COPYRIGHT}`;

/**
 * STYLES
 */
export const STYLE_FONT_FAMILY = `${SCPreferenceSection.STYLE}.${SCPreferenceName.FONT_FAMILY}`;

/**
 * LOGO
 */
export const LOGO_NAVBAR_LOGO = `${SCPreferenceSection.LOGO}.${SCPreferenceName.NAVBAR_LOGO}`;
export const LOGO_NAVBAR_LOGO_MOBILE = `${SCPreferenceSection.LOGO}.${SCPreferenceName.NAVBAR_LOGO_MOBILE}`;

/**
 * COLORS
 */
export const COLORS_COLORBACK = `${SCPreferenceSection.COLORS}.${SCPreferenceName.COLORBACK}`;
export const COLORS_COLORPRIMARY = `${SCPreferenceSection.COLORS}.${SCPreferenceName.COLORPRIMARY}`;
export const COLORS_COLORSECONDARY = `${SCPreferenceSection.COLORS}.${SCPreferenceName.COLORSECONDARY}`;
export const COLORS_NAVBARBACK = `${SCPreferenceSection.COLORS}.${SCPreferenceName.NAVBARBACK}`;
export const COLORS_SUBMENUBACK = `${SCPreferenceSection.COLORS}.${SCPreferenceName.SUBMENUBACK}`;
export const COLORS_COLORFONT = `${SCPreferenceSection.COLORS}.${SCPreferenceName.COLORFONT}`;

/**
 * COVERS
 */
export const COVERS_COVER_1_HP_M1920 = `${SCPreferenceSection.COVERS}.${SCPreferenceName.COVER_1_HP_M1920}`;
export const COVERS_COVER_2_HP_M1920 = `${SCPreferenceSection.COVERS}.${SCPreferenceName.COVER_2_HP_M1920}`;
export const COVERS_COVER_3_HP_M1920 = `${SCPreferenceSection.COVERS}.${SCPreferenceName.COVER_3_HP_M1920}`;
export const COVERS_COVER_4_HP_M1920 = `${SCPreferenceSection.COVERS}.${SCPreferenceName.COVER_4_HP_M1920}`;
export const COVERS_VISIBILITY = `${SCPreferenceSection.COVERS}.${SCPreferenceName.COVERS_VISIBILITY}`;

/**
 * IMAGES
 */
export const IMAGES_APP_ICON = `${SCPreferenceSection.IMAGES}.${SCPreferenceName.APP_ICON}`;
export const IMAGES_USER_DEFAULT_COVER = `${SCPreferenceSection.IMAGES}.${SCPreferenceName.USER_DEFAULT_COVER}`;
export const IMAGES_ERROR_404 = `${SCPreferenceSection.IMAGES}.${SCPreferenceName.ERROR_404}`;
export const IMAGES_ERROR_503 = `${SCPreferenceSection.IMAGES}.${SCPreferenceName.ERROR_503}`;
export const IMAGES_ERRORPAGES_IMAGE = `${SCPreferenceSection.IMAGES}.${SCPreferenceName.ERRORPAGES_IMAGE}`;

/**
 * STAFF
 */
export const STAFF_STAFF_BADGE_ICON = `${SCPreferenceSection.STAFF}.${SCPreferenceName.STAFF_BADGE_ICON}`;
export const STAFF_STAFF_BADGE_LABEL = `${SCPreferenceSection.STAFF}.${SCPreferenceName.STAFF_BADGE_LABEL}`;

/**
 * LOYALTY
 */
export const LOYALTY_PRIZE_A_IMAGE = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.PRIZE_A_IMAGE}`;
export const LOYALTY_PRIZE_B_IMAGE = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.PRIZE_B_IMAGE}`;
export const LOYALTY_PRIZE_C_IMAGE = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.PRIZE_C_IMAGE}`;
export const POINTS_MAKE_DISCUSSION = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_MAKE_DISCUSSION}`;
export const POINTS_MAKE_POST = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_MAKE_POST}`;
export const POINTS_MAKE_COMMENT = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_MAKE_COMMENT}`;
export const POINTS_RECEIVE_VOTE = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_RECEIVE_VOTE}`;
export const POINTS_CONNECTION_OR_FOLLOWER = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_CONNECTION_OR_FOLLOWER}`;
export const POINTS_SOCIAL_SHARE = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_SOCIAL_SHARE}`;
export const POINTS_APP_USED = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_APP_USED}`;
export const POINTS_DAILY_VISIT = `${SCPreferenceSection.LOYALTY}.${SCPreferenceName.POINTS_DAILY_VISIT}`;

/**
 * ADDONS
 */
export const ADDONS_AFFINIDY_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.AFFINIDY_ENABLED}`;
export const ADDONS_CLOSED_COMMUNITY = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.CLOSED_COMMUNITY}`;
export const ADDONS_INCUBATOR_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.INCUBATOR_ENABLED}`;
export const ADDONS_INCUBATOR_SUBSCRIBERS = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.INCUBATOR_SUBSCRIBERS}`;
export const ADDONS_LOYALTY_POINTS_COLLECTION = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.LOYALTY_POINTS_COLLECTION}`;
export const ADDONS_POLLS_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.POLLS_ENABLED}`;
export const ADDONS_REGISTRATION_WIZARD = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.REGISTRATION_WIZARD}`;
export const ADDONS_VIDEO_UPLOAD_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.VIDEO_UPLOAD_ENABLED}`;
export const ADDONS_VIMEO_TOKEN_UPLOAD = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.VIMEO_TOKEN_UPLOAD}`;
export const ADDONS_VIMEO_TOKEN_DELETE = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.VIMEO_TOKEN_DELETE}`;
export const ADDONS_VIDEO_UPLOAD_ONLY_FOR_STAFF = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.VIDEO_UPLOAD_ONLY_FOR_STAFF}`;
export const ADDONS_POST_GEOLOCATION_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.POST_GEOLOCATION_ENABLED}`;
export const ADDONS_SHARE_POST_ON_FACEBOOK_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.SHARE_POST_ON_FACEBOOK_ENABLED}`;
export const ADDONS_SHARE_POST_ON_TWITTER_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.SHARE_POST_ON_TWITTER_ENABLED}`;
export const ADDONS_SHARE_POST_ON_LINKEDIN_ENABLED = `${SCPreferenceSection.ADDONS}.${SCPreferenceName.SHARE_POST_ON_LINKEDIN_ENABLED}`;

/**
 * ADVERTISING
 */
export const ADVERTISING_CUSTOM_ADV_ENABLED = `${SCPreferenceSection.ADVERTISING}.${SCPreferenceName.CUSTOM_ADV_ENABLED}`;
export const ADVERTISING_CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED = `${SCPreferenceSection.ADVERTISING}.${SCPreferenceName.CUSTOM_ADV_ONLY_FOR_ANONYMOUS_USERS_ENABLED}`;

/**
 * CONFIGURATIONS
 */
export const CONFIGURATIONS_FOLLOW_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.FOLLOW_ENABLED}`;
export const CONFIGURATIONS_EXPLORE_STREAM_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.EXPLORE_STREAM_ENABLED}`;
export const CONFIGURATIONS_EXPLORE_STREAM_ORDER_BY = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.EXPLORE_STREAM_ORDER_BY}`;
export const CONFIGURATIONS_HOME_STREAM_ORDER_BY = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.HOME_STREAM_ORDER_BY}`;
export const CONFIGURATIONS_MANUAL_CATEGORIES_ORDER_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.MANUAL_CATEGORIES_ORDER_ENABLED}`;
export const CONFIGURATIONS_PEOPLE_SEARCH_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.PEOPLE_SEARCH_ENABLED}`;
export const CONFIGURATIONS_POST_ONLY_STAFF_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.POST_ONLY_STAFF_ENABLED}`;
export const CONFIGURATIONS_STREAM_QUALITY = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.STREAM_QUALITY}`;
export const CONFIGURATIONS_CONTENT_AVAILABILITY = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.CONTENT_AVAILABILITY}`;
export const CONFIGURATIONS_USERS_APPROVAL_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.USERS_APPROVAL_ENABLED}`;
export const CONFIGURATIONS_POST_TYPE_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.POST_TYPE_ENABLED}`;
export const CONFIGURATIONS_DISCUSSION_TYPE_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.DISCUSSION_TYPE_ENABLED}`;
export const CONFIGURATIONS_STATUS_TYPE_ENABLED = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.STATUS_TYPE_ENABLED}`;
export const CONFIGURATIONS_URL_TEMPLATE_POST = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_POST}`;
export const CONFIGURATIONS_URL_TEMPLATE_DISCUSSION = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_DISCUSSION}`;
export const CONFIGURATIONS_URL_TEMPLATE_STATUS = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_STATUS}`;
export const CONFIGURATIONS_URL_TEMPLATE_COMMENT = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_COMMENT}`;
export const CONFIGURATIONS_URL_TEMPLATE_CATEGORY = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_CATEGORY}`;
export const CONFIGURATIONS_URL_TEMPLATE_CATEGORIES_LIST = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_CATEGORIES_LIST}`;
export const CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_USER_PROFILE}`;
export const CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE_SETTINGS = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_USER_PROFILE_SETTINGS}`;
export const CONFIGURATIONS_URL_TEMPLATE_USER_NOTIFICATIONS = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_USER_NOTIFICATIONS}`;
export const CONFIGURATIONS_URL_TEMPLATE_USER_PRIVATE_MESSAGES = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_USER_PRIVATE_MESSAGES}`;
export const CONFIGURATIONS_URL_TEMPLATE_INCUBATOR = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.URL_TEMPLATE_INCUBATOR}`;
export const CONFIGURATIONS_USER_METADATA_DEFINITIONS = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.USER_METADATA_DEFINITIONS}`;
export const CONFIGURATIONS_TAG_MANAGER_CONTAINER_ID = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.TAG_MANAGER_CONTAINER_ID}`;
export const CONFIGURATIONS_GDPR_COOKIE_CONSENT_EXTERNAL_HTML = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.GDPR_COOKIE_CONSENT_EXTERNAL_HTML}`;
export const CONFIGURATIONS_GDPR_SIGNUP_ACCEPT_HTML = `${SCPreferenceSection.CONFIGURATIONS}.${SCPreferenceName.GDPR_SIGNUP_ACCEPT_HTML}`;

/**
 * PROVIDERS
 */
export const PROVIDERS_APP_URL_ON_APP_STORE = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.APP_URL_ON_APP_STORE}`;
export const PROVIDERS_APP_URL_ON_GOOGLE_PLAY = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.APP_URL_ON_GOOGLE_PLAY}`;
export const PROVIDERS_FACEBOOK_SIGNIN_ENABLED = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.FACEBOOK_SIGNIN_ENABLED}`;
export const PROVIDERS_FACEBOOK_APP_KEY = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.FACEBOOK_APP_KEY}`;
export const PROVIDERS_FACEBOOK_APP_SECRET = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.FACEBOOK_APP_SECRET}`;
export const PROVIDERS_LINKEDIN_SIGNIN_ENABLED = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.LINKEDIN_SIGNIN_ENABLED}`;
export const PROVIDERS_LINKEDIN_APP_KEY = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.LINKEDIN_APP_KEY}`;
export const PROVIDERS_LINKEDIN_APP_SECRET = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.LINKEDIN_APP_SECRET}`;
export const PROVIDERS_TWITTER_SIGNIN_ENABLED = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.TWITTER_SIGNIN_ENABLED}`;
export const PROVIDERS_TWITTER_APP_KEY = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.TWITTER_APP_KEY}`;
export const PROVIDERS_TWITTER_APP_SECRET = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.TWITTER_APP_SECRET}`;
export const PROVIDERS_GOOGLE_GEOCODING_API_KEY = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.GOOGLE_GEOCODING_API_KEY}`;
export const PROVIDERS_GOOGLE_SIGNIN_ENABLED = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.GOOGLE_SIGNIN_ENABLED}`;
export const PROVIDERS_GOOGLE_APP_KEY = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.GOOGLE_APP_KEY}`;
export const PROVIDERS_GOOGLE_APP_SECRET = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.GOOGLE_APP_SECRET}`;
export const PROVIDERS_WEB_PUSH_PUBLIC_KEY = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.WEB_PUSH_PUBLIC_KEY}`;
export const PROVIDERS_WEB_PUSH_ENABLED = `${SCPreferenceSection.PROVIDERS}.${SCPreferenceName.WEB_PUSH_ENABLED}`;

/**
 * WEBMASTERS
 */
export const WEBMASTER_META_ROBOTS = `${SCPreferenceSection.WEBMASTER}.${SCPreferenceName.META_ROBOTS}`;
export const WEBMASTER_META_TITLE_HOME_NOT_LOGGED = `${SCPreferenceSection.WEBMASTER}.${SCPreferenceName.META_TITLE_HOME_NOT_LOGGED}`;
export const WEBMASTER_META_DESCRIPTION = `${SCPreferenceSection.WEBMASTER}.${SCPreferenceName.META_DESCRIPTION}`;

const booleanType = (value) => {
  if (value === 'True') {
    return true;
  } else if (value === 'False') {
    return false;
  }
  return null;
};

export const getPreferenceSection = (value) => {
  if (value) {
    const [section] = value.split('.');
    return section;
  }
  return null;
};

export const getPreferenceName = (value) => {
  if (value) {
    const [, name] = value.split('.');
    return name;
  }
  return null;
};

export const getPreference = (value) => {
  if (value) {
    const [section, name] = value.split('.');
    return {section, name};
  }
  return null;
};

const integerType = (value) => {
  return parseInt(value, 10);
};

const stringType = (value) => value.toString();

export const DATA_TYPES = {
  [TEXT_APPLICATION_SLOGAN1]: stringType,
  [TEXT_APPLICATION_SLOGAN2]: stringType,
  [TEXT_APPLICATION_COPYRIGHT]: stringType,
  [LOGO_NAVBAR_LOGO]: stringType,
  [LOGO_NAVBAR_LOGO_MOBILE]: stringType,
  [COLORS_COLORBACK]: stringType,
  [COLORS_COLORPRIMARY]: stringType,
  [COLORS_COLORSECONDARY]: stringType,
  [COLORS_NAVBARBACK]: stringType,
  [COLORS_SUBMENUBACK]: stringType,
  [COLORS_COLORFONT]: stringType,
  [COVERS_COVER_1_HP_M1920]: stringType,
  [COVERS_COVER_2_HP_M1920]: stringType,
  [COVERS_COVER_3_HP_M1920]: stringType,
  [COVERS_COVER_4_HP_M1920]: stringType,
  [COVERS_VISIBILITY]: integerType,
  [IMAGES_APP_ICON]: stringType,
  [IMAGES_USER_DEFAULT_COVER]: stringType,
  [IMAGES_ERROR_404]: stringType,
  [IMAGES_ERROR_503]: stringType,
  [IMAGES_ERRORPAGES_IMAGE]: stringType,
  [STAFF_STAFF_BADGE_ICON]: stringType,
  [STAFF_STAFF_BADGE_LABEL]: stringType,
  [LOYALTY_PRIZE_A_IMAGE]: stringType,
  [LOYALTY_PRIZE_B_IMAGE]: stringType,
  [LOYALTY_PRIZE_C_IMAGE]: stringType,
  [ADDONS_AFFINIDY_ENABLED]: booleanType,
  [ADDONS_CLOSED_COMMUNITY]: booleanType,
  [ADDONS_INCUBATOR_ENABLED]: booleanType,
  [ADDONS_INCUBATOR_SUBSCRIBERS]: integerType,
  [ADDONS_LOYALTY_POINTS_COLLECTION]: booleanType,
  [ADDONS_POLLS_ENABLED]: booleanType,
  [ADDONS_REGISTRATION_WIZARD]: booleanType,
  [ADDONS_VIDEO_UPLOAD_ENABLED]: booleanType,
  [ADDONS_VIMEO_TOKEN_UPLOAD]: stringType,
  [ADDONS_VIMEO_TOKEN_DELETE]: stringType,
  [ADDONS_VIDEO_UPLOAD_ONLY_FOR_STAFF]: booleanType,
  [ADDONS_POST_GEOLOCATION_ENABLED]: booleanType,
  [ADDONS_SHARE_POST_ON_FACEBOOK_ENABLED]: booleanType,
  [ADDONS_SHARE_POST_ON_TWITTER_ENABLED]: booleanType,
  [ADDONS_SHARE_POST_ON_LINKEDIN_ENABLED]: booleanType,
  [CONFIGURATIONS_FOLLOW_ENABLED]: booleanType,
  [CONFIGURATIONS_EXPLORE_STREAM_ENABLED]: booleanType,
  [CONFIGURATIONS_EXPLORE_STREAM_ORDER_BY]: stringType,
  [CONFIGURATIONS_HOME_STREAM_ORDER_BY]: stringType,
  [CONFIGURATIONS_MANUAL_CATEGORIES_ORDER_ENABLED]: booleanType,
  [CONFIGURATIONS_PEOPLE_SEARCH_ENABLED]: booleanType,
  [CONFIGURATIONS_POST_ONLY_STAFF_ENABLED]: booleanType,
  [CONFIGURATIONS_CONTENT_AVAILABILITY]: booleanType,
  [CONFIGURATIONS_STREAM_QUALITY]: booleanType,
  [CONFIGURATIONS_USERS_APPROVAL_ENABLED]: booleanType,
  [CONFIGURATIONS_DISCUSSION_TYPE_ENABLED]: booleanType,
  [CONFIGURATIONS_STATUS_TYPE_ENABLED]: booleanType,
  [CONFIGURATIONS_URL_TEMPLATE_POST]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_DISCUSSION]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_STATUS]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_COMMENT]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_CATEGORY]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_CATEGORIES_LIST]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_USER_PROFILE_SETTINGS]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_USER_NOTIFICATIONS]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_USER_PRIVATE_MESSAGES]: stringType,
  [CONFIGURATIONS_URL_TEMPLATE_INCUBATOR]: stringType,
  [CONFIGURATIONS_USER_METADATA_DEFINITIONS]: stringType,
  [CONFIGURATIONS_TAG_MANAGER_CONTAINER_ID]: stringType,
  [CONFIGURATIONS_GDPR_COOKIE_CONSENT_EXTERNAL_HTML]: stringType,
  [CONFIGURATIONS_GDPR_SIGNUP_ACCEPT_HTML]: stringType,
  [PROVIDERS_APP_URL_ON_APP_STORE]: stringType,
  [PROVIDERS_APP_URL_ON_GOOGLE_PLAY]: stringType,
  [PROVIDERS_FACEBOOK_SIGNIN_ENABLED]: stringType,
  [PROVIDERS_FACEBOOK_APP_KEY]: stringType,
  [PROVIDERS_FACEBOOK_APP_SECRET]: stringType,
  [PROVIDERS_LINKEDIN_SIGNIN_ENABLED]: stringType,
  [PROVIDERS_LINKEDIN_APP_KEY]: stringType,
  [PROVIDERS_LINKEDIN_APP_SECRET]: stringType,
  [PROVIDERS_TWITTER_SIGNIN_ENABLED]: stringType,
  [PROVIDERS_TWITTER_APP_KEY]: stringType,
  [PROVIDERS_TWITTER_APP_SECRET]: stringType,
  [PROVIDERS_GOOGLE_GEOCODING_API_KEY]: stringType,
  [PROVIDERS_GOOGLE_SIGNIN_ENABLED]: stringType,
  [PROVIDERS_GOOGLE_APP_KEY]: stringType,
  [PROVIDERS_GOOGLE_APP_SECRET]: stringType,
  [PROVIDERS_WEB_PUSH_PUBLIC_KEY]: stringType,
  [PROVIDERS_WEB_PUSH_ENABLED]: booleanType,
  [WEBMASTER_META_ROBOTS]: stringType,
  [WEBMASTER_META_TITLE_HOME_NOT_LOGGED]: stringType,
  [WEBMASTER_META_DESCRIPTION]: stringType,
};
