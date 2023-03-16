export const PORTAL_OPTION = 'portal';
export const ROUTER_OPTION = 'router';

/**
 * Routes name
 */
export const HOME_ROUTE_NAME = 'home';
export const EXPLORE_ROUTE_NAME = 'explore';
export const POST_ROUTE_NAME = 'post';
export const DISCUSSION_ROUTE_NAME = 'discussion';
export const STATUS_ROUTE_NAME = 'status';
export const COMMENT_ROUTE_NAME = 'comment';
export const CATEGORY_ROUTE_NAME = 'category';
export const CATEGORIES_LIST_ROUTE_NAME = 'categories';
export const USER_PROFILE_ROUTE_NAME = 'user_profile';
export const USER_PROFILE_SETTINGS_ROUTE_NAME = 'user_profile_settings';
export const USER_NOTIFICATIONS_ROUTE_NAME = 'user_notifications';
export const USER_PRIVATE_MESSAGES_ROUTE_NAME = 'user_messages';
export const USER_PROFILE_FOLLOWINGS_ROUTE_NAME = 'user_profile_followings';
export const USER_PROFILE_FOLLOWERS_ROUTE_NAME = 'user_followers';
export const USER_PROFILE_CONNECTIONS_ROUTE_NAME = 'user_connections';
export const USER_PROFILE_CATEGORIES_ROUTE_NAME = 'user_categories';
export const USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME = 'user_followed_posts';
export const USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME = 'user_followed_discussions';
export const PEOPLE_SUGGESTION_ROUTE_NAME = 'people_suggestion';
export const LOYALTY_ROUTE_NAME = 'loyalty';
export const INCUBATOR_ROUTE_NAME = 'incubator';
export const SIGNIN_ROUTE_NAME = 'signin';
export const SIGNUP_ROUTE_NAME = 'signup';
export const RECOVER_ROUTE_NAME = 'recover';
export const CUSTOM_PAGES_ROUTE_NAME = 'custom_pages';
export const LEGAL_PAGES_ROUTE_NAME = 'legal_pages';

/**
 * Default Routes
 * @type {{[p: string]: string, '[POST_ROUTE_NAME]': string, '[INCUBATOR_ROUTE_NAME]': string, '[LOYALTY_ROUTE_NAME]': string, '[USER_NOTIFICATION_ROUTE_NAME]': string, '[USER_PRIVATE_MESSAGES_ROUTE_NAME]': string, '[COMMENT_ROUTE_NAME]': string, '[DISCUSSION_ROUTE_NAME]': string, '[CATEGORIES_ROUTE_NAME]': string, '[USER_PROFILE_ROUTE_NAME]': string, '[CATEGORY_ROUTE_NAME]': string, '[USER_PROFILE_SETTINGS_ROUTE_NAME]': string, '[STATUS_ROUTE_NAME]': string}}
 */
export const defaultRoutes: {[k: string]: string} = {
  [HOME_ROUTE_NAME]: '/',
  [EXPLORE_ROUTE_NAME]: '/explore/',
  [POST_ROUTE_NAME]: '/post/:id/',
  [DISCUSSION_ROUTE_NAME]: '/discussion/:id/',
  [STATUS_ROUTE_NAME]: '/status/:id/',
  [COMMENT_ROUTE_NAME]: '/:contribution_type/:contribution_id/comment/:id/',
  [CATEGORY_ROUTE_NAME]: '/category/:id/',
  [CATEGORIES_LIST_ROUTE_NAME]: '/categories/',
  [USER_PROFILE_ROUTE_NAME]: '/user/:id/',
  [USER_PROFILE_SETTINGS_ROUTE_NAME]: '/user/:id/edit/',
  [USER_NOTIFICATIONS_ROUTE_NAME]: '/notification/',
  [USER_PRIVATE_MESSAGES_ROUTE_NAME]: '/messages/:id/',
  [USER_PROFILE_FOLLOWINGS_ROUTE_NAME]: '/user/:id/followings/',
  [USER_PROFILE_FOLLOWERS_ROUTE_NAME]: '/user/:id/followers/',
  [USER_PROFILE_CONNECTIONS_ROUTE_NAME]: '/user/:id/connections/',
  [USER_PROFILE_CATEGORIES_ROUTE_NAME]: '/user/:id/categories/',
  [USER_PROFILE_FOLLOWED_POSTS_ROUTE_NAME]: '/user/:id/posts/followed/',
  [USER_PROFILE_FOLLOWED_DISCUSSIONS_ROUTE_NAME]: '/user/:id/discussions/followed/',
  [PEOPLE_SUGGESTION_ROUTE_NAME]: '/people/',
  [LOYALTY_ROUTE_NAME]: '/loyalty/',
  [INCUBATOR_ROUTE_NAME]: '/incubator/:id/',
  [SIGNIN_ROUTE_NAME]: '/signin/',
  [SIGNUP_ROUTE_NAME]: '/signup/',
  [RECOVER_ROUTE_NAME]: '/recover/',
  [CUSTOM_PAGES_ROUTE_NAME]: '/:id/:slug/',
  [LEGAL_PAGES_ROUTE_NAME]: '/legal/:policy/',
};
