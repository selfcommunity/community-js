/**
 * Routes name
 */
export const POST_ROUTE_NAME = 'post';
export const DISCUSSION_ROUTE_NAME = 'discussion';
export const STATUS_ROUTE_NAME = 'status';
export const COMMENT_ROUTE_NAME = 'comment';
export const CATEGORY_ROUTE_NAME = 'category';
export const CATEGORIES_LIST_ROUTE_NAME = 'categories';
export const USER_PROFILE_ROUTE_NAME = 'user_profile';
export const USER_PROFILE_SETTINGS_ROUTE_NAME = 'user_profile_settings';
export const USER_NOTIFICATIONS_ROUTE_NAME = 'user_notification';
export const USER_PRIVATE_MESSAGES_ROUTE_NAME = 'user_messages';
export const LOYALTY_ROUTE_NAME = 'loyalty';
export const INCUBATOR_ROUTE_NAME = 'incubator';

/**
 * Default Routes
 * @type {{[p: string]: string, '[POST_ROUTE_NAME]': string, '[INCUBATOR_ROUTE_NAME]': string, '[LOYALTY_ROUTE_NAME]': string, '[USER_NOTIFICATION_ROUTE_NAME]': string, '[USER_PRIVATE_MESSAGES_ROUTE_NAME]': string, '[COMMENT_ROUTE_NAME]': string, '[DISCUSSION_ROUTE_NAME]': string, '[CATEGORIES_ROUTE_NAME]': string, '[USER_PROFILE_ROUTE_NAME]': string, '[CATEGORY_ROUTE_NAME]': string, '[USER_PROFILE_SETTINGS_ROUTE_NAME]': string, '[STATUS_ROUTE_NAME]': string}}
 */
export const defaultRoutes: {[k: string]: string} = {
  [POST_ROUTE_NAME]: '/post/{id}/',
  [DISCUSSION_ROUTE_NAME]: '/discussion/{id}/',
  [STATUS_ROUTE_NAME]: '/status/{id}/',
  [COMMENT_ROUTE_NAME]: '/{contribution_type}/{contribution_id}/comment/{id}/',
  [CATEGORY_ROUTE_NAME]: '/category/{id}/',
  [CATEGORIES_LIST_ROUTE_NAME]: '/categories/',
  [USER_PROFILE_ROUTE_NAME]: '/user/{id}/',
  [USER_PROFILE_SETTINGS_ROUTE_NAME]: '/user/{id}/edit/',
  [USER_NOTIFICATIONS_ROUTE_NAME]: '/notification/',
  [USER_PRIVATE_MESSAGES_ROUTE_NAME]: '/messages/{id}/',
  [LOYALTY_ROUTE_NAME]: '/loyalty/',
  [INCUBATOR_ROUTE_NAME]: '/incubator/{id}/',
};
