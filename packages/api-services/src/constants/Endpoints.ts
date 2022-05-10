import {urlReplacer} from '../utils/url';
import {Method} from 'axios';

export interface EndpointType {
  url: (params?: object) => string;
  method: Method;
}

const Endpoints: {[key: string]: EndpointType} = {
  /**
   * OAuth2 Endpoints
   */
  OAuthToken: {
    url: urlReplacer('/oauth/token/'),
    method: 'POST'
  },
  /**
   * Preferences Endpoints
   */
  Preferences: {
    url: urlReplacer('/api/v2/dynamic_preference/'),
    method: 'GET'
  },
  /**
   * Features Endpoints
   * */
  Feature: {
    url: urlReplacer('/api/v2/feature/'),
    method: 'GET'
  },
  /**
   * FeedObject Endpoints
   */
  FeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/'),
    method: 'GET'
  },
  DeleteFeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/'),
    method: 'DELETE'
  },
  RestoreFeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/restore/'),
    method: 'POST'
  },
  RelatedFeedObjects: {
    url: urlReplacer('/api/v2/$(type)/$(id)/related/'),
    method: 'GET'
  },
  /**
   * Comments
   */
  Comment: {
    url: urlReplacer('/api/v2/comment/$(id)/'),
    method: 'GET'
  },
  NewComment: {
    url: urlReplacer('/api/v2/comment/'),
    method: 'POST'
  },
  UpdateComment: {
    url: urlReplacer('/api/v2/comment/$(id)/'),
    method: 'PUT'
  },
  DeleteComment: {
    url: urlReplacer('/api/v2/comment/$(id)/'),
    method: 'DELETE'
  },
  RestoreComment: {
    url: urlReplacer('/api/v2/comment/$(id)/restore/'),
    method: 'POST'
  },
  Comments: {
    url: urlReplacer('/api/v2/comment/'),
    method: 'GET'
  },
  CommentVote: {
    url: urlReplacer('/api/v2/comment/$(id)/vote/'),
    method: 'POST'
  },
  CommentRestore: {
    url: urlReplacer('/api/v2/comment/$(id)/restore'),
    method: 'POST'
  },
  /**
   * Reporting Flag Endpoints
   */
  FlagStatus: {
    url: urlReplacer('/api/v2/$(type)/$(id)/flag/status/'),
    method: 'GET'
  },
  Flag: {
    url: urlReplacer('/api/v2/$(type)/$(id)/flag/'),
    method: 'POST'
  },
  /**
   * Categories Endpoints
   */
  CategoryList: {
    url: urlReplacer('/api/v2/category/'),
    method: 'GET'
  },
  Category: {
    url: urlReplacer('/api/v2/category/$(id)/'),
    method: 'GET'
  },
  CategoriesFollowed: {
    url: urlReplacer('/api/v2/category/followed/'),
    method: 'GET'
  },
  CategoryFollowers: {
    url: urlReplacer('/api/v2/category/$(id)/followers/'),
    method: 'GET'
  },
  CategoriesSuggestion: {
    url: urlReplacer('/api/v2/suggestion/category/'),
    method: 'GET'
  },
  CategoryTrendingFeed: {
    url: urlReplacer('/api/v2/category/$(id)/feed/trending/'),
    method: 'GET'
  },
  CategoryTrendingPeople: {
    url: urlReplacer('/api/v2/category/$(id)/followers/trending/'),
    method: 'GET'
  },
  FollowCategory: {
    url: urlReplacer('/api/v2/category/$(id)/follow/'),
    method: 'POST'
  },
  CheckCategoryIsFollowed: {
    url: urlReplacer('/api/v2/category/$(id)/is_followed/'),
    method: 'GET'
  },
  PopularCategories: {
    url: urlReplacer('/api/v2/category/popular/'),
    method: 'GET'
  },
  /**
   * Tag Endpoints
   */
  Tag: {
    url: urlReplacer('/api/v2/tag/$(id)/'),
    method: 'GET'
  },
  /**
   * User Endpoints
   */
  UserSearch: {
    url: urlReplacer('/api/v2/user/search/'),
    method: 'GET'
  },
  User: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'GET'
  },
  UserPatch: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'PATCH'
  },
  UserSettings: {
    url: urlReplacer('/api/v2/user/$(id)/settings/'),
    method: 'GET'
  },
  UserSettingsPatch: {
    url: urlReplacer('/api/v2/user/$(id)/settings/'),
    method: 'PATCH'
  },
  GetUserLoyaltyPoints: {
    url: urlReplacer('/api/v2/user/$(id)/loyalty/points/'),
    method: 'GET'
  },
  UserFollowers: {
    url: urlReplacer('/api/v2/user/$(id)/followers/'),
    method: 'GET'
  },
  UsersFollowed: {
    url: urlReplacer('/api/v2/user/$(id)/followings/'),
    method: 'GET'
  },
  FollowUser: {
    url: urlReplacer('/api/v2/user/$(id)/follow/'),
    method: 'POST'
  },
  CheckUserFollowed: {
    url: urlReplacer('/api/v2/user/$(id)/is_followed/'),
    method: 'GET'
  },
  UserConnections: {
    url: urlReplacer('/api/v2/user/$(id)/connections/'),
    method: 'GET'
  },
  UserCheckConnection: {
    url: urlReplacer('/api/v2/user/$(id)/is_connection/'),
    method: 'GET'
  },
  UserConnectionStatuses: {
    url: urlReplacer('/api/v2/user/connection/statuses/'),
    method: 'POST'
  },
  UserConnectionRequests: {
    url: urlReplacer('/api/v2/user/$(id)/connection/requests/'),
    method: 'POST'
  },
  UserRequestConnections: {
    url: urlReplacer('/api/v2/user/$(id)/connection/requests_sent/'),
    method: 'POST'
  },
  UserRequestConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/request'),
    method: 'POST'
  },
  UserCancelRequestConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/cancel_request'),
    method: 'POST'
  },
  UserAcceptRequestConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/accept/'),
    method: 'POST'
  },
  UserRejectConnectionRequest: {
    url: urlReplacer('/api/v2/user/$(id)/connection/reject'),
    method: 'POST'
  },
  UserCancelRejectConnectionRequest: {
    url: urlReplacer('/api/v2/user/$(id)/connection/cancel_reject'),
    method: 'POST'
  },
  UserRemoveConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/remove'),
    method: 'POST'
  },
  Me: {
    url: urlReplacer('/api/v2/user/me/'),
    method: 'GET'
  },
  UpdateUser: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'PATCH'
  },
  FollowedCategories: {
    url: urlReplacer('/api/v2/user/$(id)/categories'),
    method: 'GET'
  },
  GetAvatars: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'GET'
  },
  SetPrimaryAvatar: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'PATCH'
  },
  AddAvatar: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'POST'
  },
  RemoveAvatar: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'DELETE'
  },
  CheckEmailToken: {
    url: urlReplacer('/api/v2/user/check_email_token/'),
    method: 'GET'
  },

  /**
   * Broadcast Messages
   */
  BroadcastMessagesList: {
    url: urlReplacer('/api/v2/notification/banner/'),
    method: 'GET'
  },
  BroadcastMessagesMarkRead: {
    url: urlReplacer('/api/v2/notification/banner/read/'),
    method: 'POST'
  },
  BroadcastMessagesDispose: {
    url: urlReplacer('/api/v2/notification/banner/dispose/'),
    method: 'POST'
  },
  BroadcastMessagesUnseenCount: {
    url: urlReplacer('/api/v2/notification/banner/unseen/count/'),
    method: 'GET'
  },
  /**
   * Notifications
   */
  UserNotificationList: {
    url: urlReplacer('/api/v2/notification/'),
    method: 'GET'
  },
  UserMarkReadNotification: {
    url: urlReplacer('/api/v2/notification/read/'),
    method: 'POST'
  },
  UserUnseenNotificationCount: {
    url: urlReplacer('/api/v2/notification/unseen/'),
    method: 'GET'
  },
  UserSuspendContributionNotification: {
    url: urlReplacer('/api/v2/$(type)/$(id)/suspend/'),
    method: 'POST'
  },
  UserCheckContributionNotificationSuspended: {
    url: urlReplacer('/api/v2/$(type)/$(id)/suspended/'),
    method: 'GET'
  },
  UserListContributionNotificationSuspended: {
    url: urlReplacer('/api/v2/$(type)/suspended/'),
    method: 'GET'
  },

  /**
   * Suggestion Endpoints
   */
  UserSuggestion: {
    url: urlReplacer('/api/v2/suggestion/user/'),
    method: 'GET'
  },
  Platform: {
    url: urlReplacer('/api/v2/user/me/platform_url'),
    method: 'GET'
  },
  PollSuggestion: {
    url: urlReplacer('/api/v2/suggestion/poll/'),
    method: 'GET'
  },
  /**
   * Follow
   */
  FollowContribution: {
    url: urlReplacer('/api/v2/$(type)/$(id)/follow/'),
    method: 'POST'
  },
  /**
   * Manage votes for post, discussion, status and comment
   */
  Vote: {
    url: urlReplacer('/api/v2/$(type)/$(id)/vote/'),
    method: 'POST'
  },
  VotesList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/vote/'),
    method: 'GET'
  },
  /**
   * Shares
   */
  ShareUsersList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/shares_users/'),
    method: 'GET'
  },
  /**
   * Poll
   */
  PollVote: {
    url: urlReplacer('/api/v2/$(type)/$(id)/poll/vote/'),
    method: 'POST'
  },
  PollVotesList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/poll/vote/'),
    method: 'GET'
  },

  /**
   * Contributors
   */
  Contributors: {
    url: urlReplacer('/api/v2/$(type)/$(id)/contributors/'),
    method: 'GET'
  },
  /**
   * Loyalty Endpoints
   */
  GetPrizes: {
    url: urlReplacer('/api/v2/loyalty/prize/'),
    method: 'GET'
  },
  /**
   * Composer Endpoints
   */
  Composer: {
    url: urlReplacer('/api/v2/$(type)/'),
    method: 'POST'
  },
  ComposerEdit: {
    url: urlReplacer('/api/v2/$(type)/$(id)/'),
    method: 'PUT'
  },
  ComposerChunkUploadMedia: {
    url: urlReplacer('/api/v2/media/upload/chunk/'),
    method: 'POST'
  },
  ComposerChunkUploadMediaComplete: {
    url: urlReplacer('/api/v2/media/upload/complete/'),
    method: 'POST'
  },
  ComposerMediaCreate: {
    url: urlReplacer('/api/v2/media/'),
    method: 'POST'
  },
  ComposerCategoryList: {
    url: urlReplacer('/api/v2/category/'),
    method: 'GET'
  },
  ComposerAddressingTagList: {
    url: urlReplacer('/api/v2/user/tag/tags_to_address_a_contribution/'),
    method: 'GET'
  },
  ComposerLocalitySearch: {
    url: urlReplacer('/api/v2/locality/search/'),
    method: 'GET'
  },
  /**
   * Custom ADV
   */
  CustomAdvSearch: {
    url: urlReplacer('/api/v2/custom_adv/search/'),
    method: 'GET'
  },

  /**
   * Feed
   */
  MainFeed: {
    url: urlReplacer('/api/v2/feed/'),
    method: 'GET'
  },
  MainFeedUnseenCount: {
    url: urlReplacer('/api/v2/feed/unseen/count/'),
    method: 'GET'
  },
  FeedObjectMarkRead: {
    url: urlReplacer('/api/v2/feed/read/'),
    method: 'POST'
  },
  ExploreFeed: {
    url: urlReplacer('/api/v2/feed/explore/'),
    method: 'GET'
  },
  FeedLikeThese: {
    url: urlReplacer('/api/v2/feed/likethis/'),
    method: 'POST'
  },
  CategoryFeed: {
    url: urlReplacer('/api/v2/category/$(id)/feed/'),
    method: 'GET'
  },
  UserFeed: {
    url: urlReplacer('/api/v2/user/$(id)/feed/'),
    method: 'GET'
  },
  EmbedFeed: {
    url: urlReplacer('/api/v2/embed/feed/'),
    method: 'GET'
  },
  /**
   * Private Messages Endpoints
   */
  GetSnippets: {
    url: urlReplacer('/api/v2/pm/'),
    method: 'GET'
  },
  GetASingleMessage: {
    url: urlReplacer('/api/v2/pm/$(id)/'),
    method: 'GET'
  },
  SendMessage: {
    url: urlReplacer('/api/v2/pm/'),
    method: 'POST'
  },
  GetAThread: {
    url: urlReplacer('/api/v2/pm/'),
    method: 'GET'
  },
  PrivateMessageUploadMediaInChunks: {
    url: urlReplacer('/api/v2/pm/upload/'),
    method: 'POST'
  },
  PrivateMessageChunkUploadDone: {
    url: urlReplacer('/api/v2/pm/upload/?done'),
    method: 'POST'
  },
  DeleteASingleMessage: {
    url: urlReplacer('/api/v2/pm/$(id)/'),
    method: 'DELETE'
  },
  DeleteAThread: {
    url: urlReplacer('/api/v2/pm/$(id)/?hide=1'),
    method: 'DELETE'
  },

  /**
   * Device
   */
  Device: {
    url: urlReplacer('/api/v2/device/$(type)/$(id)/'),
    method: 'GET'
  },
  NewDevice: {
    url: urlReplacer('/api/v2/device/$(type)/'),
    method: 'POST'
  },
  DeleteDevice: {
    url: urlReplacer('/api/v2/device/$(type)/$(id)/'),
    method: 'DELETE'
  },

  /**
   * Moderation
   */
  ModerateContribution: {
    url: urlReplacer('/api/v2/moderation/contribution/$(id)/'),
    method: 'PATCH'
  },
  /**
   * Moderation
   */
  ModerateContributionStatus: {
    url: urlReplacer('/api/v2/moderation/contribution/$(id)/status/?contribution_type=$(contribution_type)'),
    method: 'GET'
  },

  /**
   * Insights
   **/
  InsightBestContribution: {
    url: urlReplacer('/api/v2/insight/contribution/'),
    method: 'GET'
  },
  InsightBestEmbed: {
    url: urlReplacer('/api/v2/insight/embed/'),
    method: 'GET'
  },
  InsightBestUser: {
    url: urlReplacer('/api/v2/insight/user/'),
    method: 'GET'
  },
  InsightContributionCounter: {
    url: urlReplacer('/api/v2/insight/contribution/counters/?contribution_id=$(id)'),
    method: 'GET'
  },
  InsightEmbedCounter: {
    url: urlReplacer('/api/v2/insight/embed/counters/?embed_type=$(type)&embed_id=$(id)'),
    method: 'GET'
  },
  InsightUserCounter: {
    url: urlReplacer('/api/v2/insight/user/counters/?user_id=$(id)'),
    method: 'GET'
  },

  /**
   * Incubators
   */
  GetAllIncubators: {
    url: urlReplacer('/api/v2/incubator/'),
    method: 'GET'
  },
  GetIncubatorSuggestion: {
    url: urlReplacer('/api/v2/suggestion/incubator/'),
    method: 'GET'
  },
  GetASpecificIncubator: {
    url: urlReplacer('/api/v2/incubator/$(id)/'),
    method: 'GET'
  },
  CheckIncubatorSubscription: {
    url: urlReplacer('/api/v2/incubator/$(id)/subscribed/'),
    method: 'GET'
  },
  SubscribeToIncubator: {
    url: urlReplacer('/api/v2/incubator/$(id)/subscribe/'),
    method: 'POST'
  },
  CreateAnIncubator: {
    url: urlReplacer('/api/v2/incubator/'),
    method: 'POST'
  },
  GetIncubatorSubscribers: {
    url: urlReplacer('/api/v2/incubator/$(id)/subscribers/'),
    method: 'GET'
  },
  /**
   * Footer
   */
  GetCustomPages: {
    url: urlReplacer('/api/v2/custom_page/'),
    method: 'GET'
  },
  GetLegalPages: {
    url: urlReplacer('/api/v2/legal_page/'),
    method: 'GET'
  },
  /**
   * Media
   */
  MediaClickTracker: {
    url: urlReplacer('/api/v2/media/$(id)/click/'),
    method: 'POST'
  }
};

export default Endpoints;
