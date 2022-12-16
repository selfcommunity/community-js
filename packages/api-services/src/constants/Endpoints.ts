import {urlReplacer} from '@selfcommunity/utils';
import {HttpMethod} from '../client';

export interface EndpointType {
  url: (params?: object) => string;
  method: HttpMethod;
}

const Endpoints: {[key: string]: EndpointType} = {
  /**
   * Account Endpoints
   */
  AccountCreate: {
    url: urlReplacer('/api/v2/account/create/'),
    method: 'POST'
  },
  AccountVerify: {
    url: urlReplacer('/api/v2/account/verify/'),
    method: 'POST'
  },
  AccountRecover: {
    url: urlReplacer('/api/v2/account/recover/'),
    method: 'POST'
  },
  AccountReset: {
    url: urlReplacer('/api/v2/account/reset/'),
    method: 'POST'
  },
  AccountSearch: {
    url: urlReplacer('/api/v2/account/search/'),
    method: 'GET'
  },
  /**
   * Invite Code Endpoints
   */
  InviteCode: {
    url: urlReplacer('/api/v2/invite_code/$(code)/'),
    method: 'GET'
  },
  /**
   * Promo Code Endpoints
   */
  PromoCode: {
    url: urlReplacer('/api/v2/promo_code/$(code)/'),
    method: 'GET'
  },
  /**
   * OAuth2 Endpoints
   */
  OAuthToken: {
    url: urlReplacer('/oauth/token/'),
    method: 'POST'
  },
  /**
   * Dynamic Preference Endpoints
   */
  Preferences: {
    url: urlReplacer('/api/v2/dynamic_preference/'),
    method: 'GET'
  },
  GetPreference: {
    url: urlReplacer('/api/v2/dynamic_preference/$(id)/'),
    method: 'GET'
  },
  /**
   * SSO Endpoints
   */
  SignIn: {
    url: urlReplacer('/api/v2/sso/signin/'),
    method: 'POST'
  },
  SignUp: {
    url: urlReplacer('/api/v2/sso/signup/'),
    method: 'POST'
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
  FeedObjectList: {
    url: urlReplacer('/api/v2/$(type)/'),
    method: 'GET'
  },
  FeedObjectsUncommented: {
    url: urlReplacer('/api/v2/$(type)/uncommented/'),
    method: 'GET'
  },
  SearchFeedObject: {
    url: urlReplacer('/api/v2/$(type)/search/'),
    method: 'GET'
  },
  CreateFeedObject: {
    url: urlReplacer('/api/v2/$(type)/'),
    method: 'POST'
  },
  FeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/'),
    method: 'GET'
  },
  UpdateFeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/'),
    method: 'PUT'
  },
  DeleteFeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/'),
    method: 'DELETE'
  },
  FeedObjectContributorsList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/contributors/'),
    method: 'GET'
  },
  FeedObjectSharesList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/shares/'),
    method: 'GET'
  },
  FeedObjectUserSharesList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/shares_users/'),
    method: 'GET'
  },
  RestoreFeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/restore/'),
    method: 'POST'
  },
  RelatedFeedObjects: {
    url: urlReplacer('/api/v2/$(type)/$(id)/related/'),
    method: 'GET'
  },
  HideFeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/hide/'),
    method: 'POST'
  },
  FeedObjectHideStatus: {
    url: urlReplacer('/api/v2/$(type)/$(id)/hide/status/'),
    method: 'GET'
  },
  CheckIfFollowingFeedObject: {
    url: urlReplacer('/api/v2/$(type)/$(id)/following/'),
    method: 'GET'
  },
  FeedObjectFollowingList: {
    url: urlReplacer('/api/v2/$(type)/following/'),
    method: 'GET'
  },
  FeedObjectFlagList: {
    url: urlReplacer('/api/v2/$(type)/$(id)/flag/'),
    method: 'POST'
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
  CommentVotesList: {
    url: urlReplacer('/api/v2/comment/$(id)/vote/'),
    method: 'GET'
  },
  CommentRestore: {
    url: urlReplacer('/api/v2/comment/$(id)/restore'),
    method: 'POST'
  },
  CommentFlagList: {
    url: urlReplacer('/api/v2/comment/$(id)/flag/'),
    method: 'GET'
  },
  FlagComment: {
    url: urlReplacer('/api/v2/comment/$(id)/flag/'),
    method: 'POST'
  },
  CommentFlagStatus: {
    url: urlReplacer('/api/v2/comment/$(id)/flag/status/'),
    method: 'GET'
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
  SearchCategory: {
    url: urlReplacer('/api/v2/category/search/'),
    method: 'GET'
  },
  CreateCategory: {
    url: urlReplacer('/api/v2/category/'),
    method: 'POST'
  },
  UpdateCategory: {
    url: urlReplacer('/api/v2/category/$(id)/'),
    method: 'PUT'
  },
  PatchCategory: {
    url: urlReplacer('/api/v2/category/$(id)/'),
    method: 'PATCH'
  },
  DeleteCategory: {
    url: urlReplacer('/api/v2/category/$(id)/'),
    method: 'DELETE'
  },
  CategoryAudience: {
    url: urlReplacer('/api/v2/category/$(id)/audience/'),
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
  TagsList: {
    url: urlReplacer('/api/v2/tag/'),
    method: 'GET'
  },
  CreateTag: {
    url: urlReplacer('/api/v2/tag/'),
    method: 'POST'
  },
  SearchTag: {
    url: urlReplacer('/api/v2/tag/'),
    method: 'GET'
  },
  Tag: {
    url: urlReplacer('/api/v2/tag/$(id)/'),
    method: 'GET'
  },
  UpdateTag: {
    url: urlReplacer('/api/v2/tag/$(id)/'),
    method: 'PUT'
  },
  PatchTag: {
    url: urlReplacer('/api/v2/tag/$(id)/'),
    method: 'PATCH'
  },
  AssignTag: {
    url: urlReplacer('/api/v2/tag/$(id)/assign/'),
    method: 'POST'
  },
  /**
   * User Endpoints
   */
  UserList: {
    url: urlReplacer('/api/v2/user/'),
    method: 'GET'
  },
  ListHiddenUsers: {
    url: urlReplacer('/api/v2/user/hidden_users/'),
    method: 'GET'
  },
  UserAutocomplete: {
    url: urlReplacer('/api/v2/user/autocomplete/'),
    method: 'GET'
  },
  UserSearch: {
    url: urlReplacer('/api/v2/user/search/'),
    method: 'GET'
  },
  User: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'GET'
  },
  UserCounters: {
    url: urlReplacer('/api/v2/user/$(id)/counters/'),
    method: 'GET'
  },
  UserUpdate: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'PUT'
  },
  UserPatch: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'PATCH'
  },
  UserDelete: {
    url: urlReplacer('/api/v2/user/$(id)/'),
    method: 'DELETE'
  },
  ChangeUserMail: {
    url: urlReplacer('/api/v2/user/$(id)/change_email/'),
    method: 'PATCH'
  },
  ConfirmUserChangeMail: {
    url: urlReplacer('/api/v2/user/$(id)/confirm_email/'),
    method: 'POST'
  },
  ChangeUserPassword: {
    url: urlReplacer('/api/v2/user/$(id)/change_password/'),
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
  Me: {
    url: urlReplacer('/api/v2/user/me/'),
    method: 'GET'
  },
  MyAvatar: {
    url: urlReplacer('/api/v2/user/me/avatar/'),
    method: 'GET'
  },
  Permission: {
    url: urlReplacer('/api/v2/user/me/permission/'),
    method: 'GET'
  },
  Platform: {
    url: urlReplacer('/api/v2/user/me/platform_url/'),
    method: 'GET'
  },
  FollowedCategories: {
    url: urlReplacer('/api/v2/user/$(id)/categories/'),
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
  CheckUserFollower: {
    url: urlReplacer('/api/v2/user/$(id)/is_follower/'),
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
  UserConnectionRequests: {
    url: urlReplacer('/api/v2/user/$(id)/connection/requests/'),
    method: 'GET'
  },
  UserRequestConnectionsSent: {
    url: urlReplacer('/api/v2/user/$(id)/connection/requests_sent/'),
    method: 'GET'
  },
  UserAcceptRequestConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/accept/'),
    method: 'POST'
  },
  UserRequestConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/request/'),
    method: 'POST'
  },
  UserRemoveConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/remove/'),
    method: 'POST'
  },
  UserCancelRejectConnectionRequest: {
    url: urlReplacer('/api/v2/user/$(id)/connection/cancel_reject/'),
    method: 'POST'
  },
  UserCancelRequestConnection: {
    url: urlReplacer('/api/v2/user/$(id)/connection/cancel_request/'),
    method: 'POST'
  },
  UserRejectConnectionRequest: {
    url: urlReplacer('/api/v2/user/$(id)/connection/reject/'),
    method: 'POST'
  },
  UserMarkSeenConnectionRequest: {
    url: urlReplacer('/api/v2/user/$(id)/connection_requests/mark_seen/'),
    method: 'POST'
  },
  UserShowHide: {
    url: urlReplacer('/api/v2/user/$(id)/hide/'),
    method: 'POST'
  },
  CheckUserHidden: {
    url: urlReplacer('/api/v2/user/$(id)/is_hidden/'),
    method: 'GET'
  },
  CheckUserHiddenBy: {
    url: urlReplacer('/api/v2/user/$(id)/is_hidden_by/'),
    method: 'GET'
  },
  GetUserLoyaltyPoints: {
    url: urlReplacer('/api/v2/user/$(id)/loyalty/points/'),
    method: 'GET'
  },
  UserConnectionStatuses: {
    url: urlReplacer('/api/v2/user/connection/statuses/'),
    method: 'POST'
  },
  UserTagToAddressContribution: {
    url: urlReplacer('/api/v2/user/tag/tags_to_address_a_contribution/'),
    method: 'GET'
  },
  CheckEmailToken: {
    url: urlReplacer('/api/v2/user/check_email_token/'),
    method: 'GET'
  },
  AddAvatar: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'POST'
  },
  GetAvatars: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'GET'
  },
  RemoveAvatar: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'DELETE'
  },
  SetPrimaryAvatar: {
    url: urlReplacer('/api/v2/user/avatar/'),
    method: 'PATCH'
  },
  ProviderAssociations: {
    url: urlReplacer('/api/v2/user/$(id)/provider/'),
    method: 'GET'
  },
  CreateProviderAssociation: {
    url: urlReplacer('/api/v2/user/$(id)/provider/'),
    method: 'POST'
  },
  DeleteProviderAssociation: {
    url: urlReplacer('/api/v2/user/$(id)/provider/'),
    method: 'DELETE'
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
  BroadcastMessagesUndisposedCount: {
    url: urlReplacer('/api/v2/notification/banner/undisposed/count/'),
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
    url: urlReplacer('/api/v2/notification/unseen/count/'),
    method: 'GET'
  },
  CreateCustomNotification: {
    url: urlReplacer('/api/v2/notification/notify/'),
    method: 'POST'
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
  CategoriesSuggestion: {
    url: urlReplacer('/api/v2/suggestion/category/'),
    method: 'GET'
  },
  GetIncubatorSuggestion: {
    url: urlReplacer('/api/v2/suggestion/incubator/'),
    method: 'GET'
  },
  PollSuggestion: {
    url: urlReplacer('/api/v2/suggestion/poll/'),
    method: 'GET'
  },
  UserSuggestion: {
    url: urlReplacer('/api/v2/suggestion/user/'),
    method: 'GET'
  },
  SearchSuggestion: {
    url: urlReplacer('/api/v2/suggestion/'),
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
  CreatePrize: {
    url: urlReplacer('/api/v2/loyalty/prize/'),
    method: 'POST'
  },
  GetSpecificPrize: {
    url: urlReplacer('/api/v2/loyalty/prize/$(id)/'),
    method: 'GET'
  },
  UpdatePrize: {
    url: urlReplacer('/api/v2/loyalty/prize/$(id)/'),
    method: 'PUT'
  },
  PatchPrize: {
    url: urlReplacer('/api/v2/loyalty/prize/$(id)/'),
    method: 'PATCH'
  },
  GetPrizeRequests: {
    url: urlReplacer('/api/v2/loyalty/request/'),
    method: 'GET'
  },
  CreatePrizeRequest: {
    url: urlReplacer('/api/v2/loyalty/request/'),
    method: 'POST'
  },
  GetSpecificPrizeRequest: {
    url: urlReplacer('/api/v2/loyalty/request/$(id)/'),
    method: 'GET'
  },
  PatchPrizeRequest: {
    url: urlReplacer('/api/v2/loyalty/request/$(id)/'),
    method: 'PATCH'
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
   * Media
   */
  GetMedia: {
    url: urlReplacer('/api/v2/media/$(id)/'),
    method: 'GET'
  },
  UpdateMedia: {
    url: urlReplacer('/api/v2/media/$(id)/'),
    method: 'PUT'
  },
  DeleteMedia: {
    url: urlReplacer('/api/v2/media/$(id)/'),
    method: 'DELETE'
  },
  MediaClickTracker: {
    url: urlReplacer('/api/v2/media/$(id)/click/'),
    method: 'POST'
  },

  /**
   * Locality
   */
  GetLocalities: {
    url: urlReplacer('/api/v2/locality/'),
    method: 'GET'
  },
  /**
   * Custom ADV
   */
  CustomAdvList: {
    url: urlReplacer('/api/v2/custom_adv/'),
    method: 'GET'
  },
  CustomAdv: {
    url: urlReplacer('/api/v2/custom_adv/$(id)/'),
    method: 'GET'
  },
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
   * Embed
   */
  EmbedList: {
    url: urlReplacer('/api/v2/embed/'),
    method: 'GET'
  },
  EmbedCreate: {
    url: urlReplacer('/api/v2/embed/'),
    method: 'POST'
  },
  EmbedSearch: {
    url: urlReplacer('/api/v2/embed/search/'),
    method: 'GET'
  },
  Embed: {
    url: urlReplacer('/api/v2/embed/$(id)/'),
    method: 'GET'
  },
  UpdateEmbed: {
    url: urlReplacer('/api/v2/embed/$(id)/'),
    method: 'PUT'
  },
  PatchEmbed: {
    url: urlReplacer('/api/v2/embed/$(id)/'),
    method: 'PATCH'
  },
  SpecificEmbedFeed: {
    url: urlReplacer('/api/v2/embed/$(id)/feed/'),
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
  PrivateMessageUploadMedia: {
    url: urlReplacer('/api/v2/pm/upload/'),
    method: 'POST'
  },
  PrivateMessageUploadThumbnail: {
    url: urlReplacer('/api/v2/pm/upload/'),
    method: 'POST'
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
  UsersForModeration: {
    url: urlReplacer('/api/v2/moderation/user/'),
    method: 'GET'
  },
  ModerateUser: {
    url: urlReplacer('/api/v2/moderation/user/$(id)/'),
    method: 'PATCH'
  },
  FlaggedContributions: {
    url: urlReplacer('/api/v2/moderation/contribution/'),
    method: 'GET'
  },
  FlagsForSpecificContribution: {
    url: urlReplacer('/api/v2/moderation/contribution/$(id)/flag/?contribution_type=$(contribution_type)'),
    method: 'GET'
  },
  ModerateContribution: {
    url: urlReplacer('/api/v2/moderation/contribution/$(id)/'),
    method: 'PATCH'
  },

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
  SearchIncubators: {
    url: urlReplacer('/api/v2/incubator/search/'),
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
   * Custom Page
   */
  GetCustomPages: {
    url: urlReplacer('/api/v2/custom_page/'),
    method: 'GET'
  },
  CustomPage: {
    url: urlReplacer('/api/v2/custom_page/$(id)/'),
    method: 'GET'
  },
  CustomPageSearch: {
    url: urlReplacer('/api/v2/custom_page/search/'),
    method: 'GET'
  },
  /**
   * Legal Page
   */
  LegalPage: {
    url: urlReplacer('/api/v2/legal_page/$(id)/'),
    method: 'GET'
  },
  GetLegalPages: {
    url: urlReplacer('/api/v2/legal_page/'),
    method: 'GET'
  },
  SearchLegalPages: {
    url: urlReplacer('/api/v2/legal_page/search/'),
    method: 'GET'
  },
  LegalPagesLastRevision: {
    url: urlReplacer('/api/v2/legal_page/last_revisions/'),
    method: 'GET'
  },
  LegalPageLastRevision: {
    url: urlReplacer('/api/v2/legal_page/$(policy)/'),
    method: 'GET'
  },
  LegalPageRevisions: {
    url: urlReplacer('/api/v2/legal_page/$(policy)/revisions/'),
    method: 'GET'
  },
  AckLegalPage: {
    url: urlReplacer('/api/v2/legal_page/$(id)/ack/'),
    method: 'POST'
  },
  SpecificUserAck: {
    url: urlReplacer('/api/v2/legal_page/$(id)/user_ack/'),
    method: 'GET'
  },
  UserAckList: {
    url: urlReplacer('/api/v2/legal_page/user_acks/'),
    method: 'GET'
  },

  /**
   * Webhook
   */
  WebhookEndpointsList: {
    url: urlReplacer('/api/v2/webhook/endpoint/'),
    method: 'GET'
  },
  WebhookEventsList: {
    url: urlReplacer('/api/v2/webhook/endpoint/event/'),
    method: 'GET'
  },
  WebhookCreate: {
    url: urlReplacer('/api/v2/webhook/endpoint/'),
    method: 'POST'
  },
  GetSpecificWebhook: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/'),
    method: 'GET'
  },
  WebhookUpdate: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/'),
    method: 'PUT'
  },
  WebhookPatch: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/'),
    method: 'PATCH'
  },
  WebhookDelete: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/'),
    method: 'DELETE'
  },
  WebhookEndpointAttempts: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/attempt/'),
    method: 'GET'
  },
  WebhookExpireSigningSecret: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/secret/expire/'),
    method: 'POST'
  },
  WebhookRevealSigningSecret: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/secret/reveal/'),
    method: 'POST'
  },
  WebhookResendEndpointEvent: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/event/resend/'),
    method: 'POST'
  },
  WebhookResendMultipleEndpointEvent: {
    url: urlReplacer('/api/v2/webhook/endpoint/$(id)/event/resend/bulk/'),
    method: 'POST'
  },
  /**
   * Data Portability
   */
  GenerateDataPortability: {
    url: urlReplacer('/api/v2/udp/'),
    method: 'POST'
  },
  DataPortabilityStatus: {
    url: urlReplacer('/api/v2/udp/'),
    method: 'GET'
  },
  DataPortabilityDownload: {
    url: urlReplacer('/api/v2/udp/download'),
    method: 'GET'
  },
  /**
   * Score
   */
  ScoresList: {
    url: urlReplacer('/api/v2/score/'),
    method: 'GET'
  },
  SearchScore: {
    url: urlReplacer('/api/v2/score/search/'),
    method: 'GET'
  },
  AddScore: {
    url: urlReplacer('/api/v2/score/'),
    method: 'POST'
  },
  /**
   * Reactions
   */
  GetReactions: {
    url: urlReplacer('/api/v2/reaction/'),
    method: 'GET'
  },
  GetSpecificReaction: {
    url: urlReplacer('/api/v2/reaction/$(id)/'),
    method: 'GET'
  }
};

export default Endpoints;
