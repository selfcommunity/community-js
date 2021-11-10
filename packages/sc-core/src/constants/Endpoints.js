import {urlReplacer} from '../utils/url';

export default {
  /**
   * Preferences Endpoints
   */
  Preferences: {
    url: urlReplacer('/api/v2/dynamic_preference/'),
    method: 'GET',
  },
  /**
   * Categories Endpoints
   */
  CategoryList: {
    url: urlReplacer('/api/v2/category/'),
    method: 'GET',
  },
  Category: {
    url: urlReplacer('/api/v2/category/$(id)/'),
    method: 'GET',
  },
  CategoriesFollowed: {
    url: urlReplacer('/api/v2/category/followed/'),
    method: 'GET',
  },
  CategoriesSuggestion: {
    url: urlReplacer('/api/v2/suggestion/category/'),
    method: 'GET',
  },
  CategoryTrendingFeed: {
    url: urlReplacer('/api/v2/category/$(id)/feed/trending/'),
    method: 'GET',
  },
  CategoryTrendingPeople: {
    url: urlReplacer('/api/v2/category/$(id)/followers/trending/'),
    method: 'GET',
  },
  FollowCategory: {
    url: urlReplacer('/api/v2/category/$(id)/follow/'),
    method: 'POST',
  },
  /**
   * User Endpoints
   */
  User: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'GET',
  },
  UserFollowers: {
    url: urlReplacer('/api/v2/user/$(id)/followers/'),
    method: 'GET',
  },
  Me: {
    url: urlReplacer('/api/v2/user/me/'),
    method: 'GET',
  },
  /**
   * Suggestion Endpoints
   */
  UserSuggestion: {
    url: urlReplacer('/api/v2/suggestion/user/'),
    method: 'GET',
  },
  Platform: {
    url: urlReplacer('/api/v2/user/me/platform_url'),
    method: 'GET',
  },
  /**
   * Composer Endpoints
   */
  Composer: {
    url: urlReplacer('/api/v2/$(type)/'),
    method: 'POST',
  },
  ComposerChunkUploadMedia: {
    url: urlReplacer('/api/v2/media/upload/chunk/'),
    method: 'POST',
  },
  ComposerChunkUploadMediaComplete: {
    url: urlReplacer('/api/v2/media/upload/complete/'),
    method: 'POST',
  },
  ComposerMediaCreate: {
    url: urlReplacer('/api/v2/media/'),
    method: 'POST',
  },
  ComposerCategoryList: {
    url: urlReplacer('/api/v2/category/'),
    method: 'GET',
  },
};
