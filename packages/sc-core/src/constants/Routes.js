/**
 * Routes name
 */
export const CATEGORY_ROUTE_NAME = 'category';
export const USER_PROFILE_ROUTE_NAME = 'profile';
export const POST_ROUTE_NAME = 'post';
export const DISCUSSION_ROUTE_NAME = 'discussion';
export const STATUS_ROUTE_NAME = 'status';
export const COMMENT_ROUTE_NAME = 'comment';
export const PRIVATE_MESSAGES_ROUTE_NAME = 'messages';

/**
 * Default Routes
 * @type {{post: string, profile: string, discussion: string, category: string, status: string, messages: string}}
 */
export const defaultRoutes = {
  [CATEGORY_ROUTE_NAME]: '/category/:id/',
  [USER_PROFILE_ROUTE_NAME]: '/user/:id/',
  [POST_ROUTE_NAME]: '/post/:id/',
  [STATUS_ROUTE_NAME]: '/status/:id/',
  [DISCUSSION_ROUTE_NAME]: '/discussion/:id/',
  [COMMENT_ROUTE_NAME]: '/comment/:id/',
  [PRIVATE_MESSAGES_ROUTE_NAME]: '/messages/',
};
