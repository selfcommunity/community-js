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
export const FEED_CACHE_PREFIX_KEY = '_feed_';
export const getFeedCacheKey = (id, next) => `${FEED_CACHE_PREFIX_KEY}${id}_${next}`;

export const FEED_STATE_CACHE_PREFIX_KEY = '_feed_st_';
export const getStateFeedCacheKey = (id) => `${FEED_STATE_CACHE_PREFIX_KEY}${id}`;

export const VIRTUALIZED_SCROLL_STATE_CACHE_PREFIX_KEY = '_virtualized_scroll_st_';
export const getVirtualizedScrollStateCacheKey = (id) => `${VIRTUALIZED_SCROLL_STATE_CACHE_PREFIX_KEY}${id}`;

export const FEED_CACHE_SP_KEY = '_feed_spos_';
export const getFeedSPCacheKey = (id) => `${FEED_CACHE_SP_KEY}${id}`;
