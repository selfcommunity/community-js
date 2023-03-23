/**
 * Cache prefixes
 */

/** FEED OBJECT **/
export const FEED_OBJECT_CACHE_PREFIX_KEY = '_fo_';
export const getFeedObjectCacheKey = (id, type) => `${FEED_OBJECT_CACHE_PREFIX_KEY}${type}_${id}`;

/** COMMMENT OBJECT **/
export const COMMENT_OBJECT_CACHE_PREFIX_KEY = '_co_';
export const getCommentObjectCacheKey = (id) => `${COMMENT_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** COMMMENT OBJECTS **/
export const COMMENT_OBJECTS_CACHE_PREFIX_KEY = '_cos_';
export const getCommentObjectsCacheKey = (id, type, next) => `${COMMENT_OBJECTS_CACHE_PREFIX_KEY}${type}_${id}_${next}`;
export const getCommentObjectsCachePrefixKeys = (id, type) => `${COMMENT_OBJECTS_CACHE_PREFIX_KEY}${type}_${id}`;

/** CATEGORIES OBJECT **/
export const CATEGORIES_OBJECT_CACHE_PREFIX_KEY = '_cas_';
export const getCategoriesObjectCacheKey = () => `${CATEGORIES_OBJECT_CACHE_PREFIX_KEY}`;

/** CATEGORY OBJECT **/
export const CATEGORY_OBJECT_CACHE_PREFIX_KEY = '_ca_';
export const getCategoryObjectCacheKey = (id) => `${CATEGORY_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** CONTRIBUTORS **/
export const CONTRIBUTORS_CACHE_PREFIX_KEY = '_contr_';
export const getContributorsCacheKey = (id, type, next) => `${CONTRIBUTORS_CACHE_PREFIX_KEY}${type}_${id}_${next}`;
export const getContributorsCachePrefixKeys = (id, type) => `${CONTRIBUTORS_CACHE_PREFIX_KEY}${type}_${id}`;

/** FEED **/

// Cache single response body
export const FEED_CACHE_PREFIX_KEY = '_feed_';
export const getFeedCacheKey = (id, next) => `${FEED_CACHE_PREFIX_KEY}${id}_${next}`;

// Cache state of the feed (ex. useSCFetchFeed)
export const FEED_STATE_CACHE_PREFIX_KEY = '_feed_st_';
export const getStateFeedCacheKey = (id) => `${FEED_STATE_CACHE_PREFIX_KEY}${id}`;

// Cache the state of the virtualized feed
export const VIRTUALIZED_SCROLL_STATE_CACHE_PREFIX_KEY = '_virtualized_scroll_st_';
export const getVirtualizedScrollStateCacheKey = (id) => `${VIRTUALIZED_SCROLL_STATE_CACHE_PREFIX_KEY}${id}`;

// Cache feed position
export const FEED_CACHE_SP_KEY = '_feed_spos_';
export const getFeedSPCacheKey = (id) => `${FEED_CACHE_SP_KEY}${id}`;

/** REACTIONS **/

// Reactions Object
export const REACTIONS_OBJECT_CACHE_PREFIX_KEY = '_res_';
export const getReactionsObjectCacheKey = () => `${REACTIONS_OBJECT_CACHE_PREFIX_KEY}`;

// Reaction Object
export const REACTION_OBJECT_CACHE_PREFIX_KEY = '_re_';
export const getReactionObjectCacheKey = (id) => `${REACTION_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** CUSTOM ADVERTISING **/
export const ADV_OBJECT_CACHE_PREFIX_KEY = '_adv_';
export const getAdvObjectCacheKey = (id) => `${ADV_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** PRIVATE MESSAGE SNIPPETS  OBJECT **/
export const PM_SNIPPETS_OBJECT_CACHE_PREFIX_KEY = '_pmss_';
export const getPmSnippetsObjectCacheKey = () => `${PM_SNIPPETS_OBJECT_CACHE_PREFIX_KEY}`;

/** PRIVATE MESSAGE SNIPPET  OBJECT **/
export const PM_SNIPPET_OBJECT_CACHE_PREFIX_KEY = '_pms_';
export const getPmSnippetObjectCacheKey = (id) => `${PM_SNIPPET_OBJECT_CACHE_PREFIX_KEY}${id}`;

/** TOOLS */
export const CATEGORIES_LIST_TOOLS_STATE_CACHE_PREFIX_KEY = '_cListTools_';
export const CATEGORIES_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY = '_cFolTools_';
export const CATEGORIES_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_cSugTools_';
export const CATEGORIES_POPULAR_TOOLS_STATE_CACHE_PREFIX_KEY = '_cPopTools_';
export const USER_FOLLOWERS_TOOLS_STATE_CACHE_PREFIX_KEY = '_uFolTools_';
export const USERS_FOLLOWED_TOOLS_STATE_CACHE_PREFIX_KEY = '_uFoldTools_';
export const TRENDING_FEED_TOOLS_STATE_CACHE_PREFIX_KEY = '_fTrendTools_';
export const RELATED_FEED_TOOLS_STATE_CACHE_PREFIX_KEY = '_rFeedTools_';
export const TRENDING_PEOPLE_TOOLS_STATE_CACHE_PREFIX_KEY = '_pTrendTools_';
export const PEOPLE_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_pSugTools_';
export const INCUBATORS_LIST_TOOLS_STATE_CACHE_PREFIX_KEY = '_iListTools_';
export const INCUBATOR_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_iSugTools_';
export const POLL_SUGGESTION_TOOLS_STATE_CACHE_PREFIX_KEY = '_pSugTools_';
export const getToolsStateCacheKey = (p, id = undefined) => `${p}${id !== undefined ? id : ''}`;
