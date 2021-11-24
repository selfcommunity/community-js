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
   * Discussion Endpoints
   */
  Discussion: {
    url: urlReplacer('/api/v2/discussion/$(id)/'),
    method: 'GET',
  },
  /**
   * Post Endpoints
   */
  Post: {
    url: urlReplacer('/api/v2/post/$(id)/'),
    method: 'GET',
  },
  /**
   * Status Endpoints
   */
  Status: {
    url: urlReplacer('/api/v2/status/$(id)/'),
    method: 'GET',
  },
  /**
   * Comments
   */
  Comment: {
    url: urlReplacer('/api/v2/comment/$(id)/'),
    method: 'GET',
  },
  Comments: {
    url: urlReplacer('/api/v2/comment/'),
    method: 'GET',
  },
  CommentVotes: {
    url: urlReplacer('/api/v2/comment/{id}/vote/'),
    method: 'GET',
  },
  /**
   * Reporting Flag Endpoints
   */
  FlagStatus: {
    url: urlReplacer('/api/v2/$(type)/$(id)/flag/status/'),
    method: 'GET',
  },
  Flag: {
    url: urlReplacer('/api/v2/$(type)/$(id)/flag/'),
    method: 'POST',
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
  CategoryFollowers: {
    url: urlReplacer('/api/v2/category/$(id)/followers/'),
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
  PopularCategories: {
    url: urlReplacer('/api/v2/category/popular/'),
    method: 'GET',
  },
  /**
   * Tag Endpoints
   */
  Tag: {
    url: urlReplacer('/api/v2/tag/$(id)/'),
    method: 'GET',
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
  UsersFollowed: {
    url: urlReplacer('/api/v2/user/$(id)/followings/'),
    method: 'GET',
  },
  UserConnections: {
    url: urlReplacer('/api/v2/user/$(id)/connections/'),
    method: 'GET',
  },
  FollowUser: {
    url: urlReplacer('/api/v2/user/$(id)/follow/'),
    method: 'POST',
  },
  CheckUserFollowed: {
    url: urlReplacer('/api/v2/user/$(id)/is_followed/'),
    method: 'GET',
  },
  RequestConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/request'),
    method: 'POST',
  },
  CancelConnectionRequest: {
    url: urlReplacer('/api/v2/user/$(id)/connection/cancel_request'),
    method: 'POST',
  },
  RemoveConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/remove'),
    method: 'POST',
  },
  CheckUserConnection: {
    url: urlReplacer('/api/v2/user/$(id)/is_connection/'),
    method: 'GET',
  },
  Me: {
    url: urlReplacer('/api/v2/user/me/'),
    method: 'GET',
  },
  UpdateUser: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'PATCH',
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
   * Votes
   */
  Vote: {
    url: urlReplacer('/api/v2/$(type)/$(id)/vote/'),
    method: 'POST',
  },
  VotesList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/vote/'),
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
  ComposerAddressingTagList: {
    url: urlReplacer('/api/v2/user/tag/tags_to_address_a_contribution/'),
    method: 'GET',
  },
  ComposerLocalitySearch: {
    url: urlReplacer('/api/v2/locality/search/'),
    method: 'GET',
  },
};
