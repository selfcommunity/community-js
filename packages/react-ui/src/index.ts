/**
 * Components
 */
import NavigationSettingsIconButton, {NavigationSettingsIconButtonProps} from './components/NavigationSettingsIconButton';
import NavigationToolbar, {NavigationToolbarProps, NavigationToolbarSkeleton} from './components/NavigationToolbar';
import NavigationToolbarMobile, {NavigationToolbarMobileProps, NavigationToolbarMobileSkeleton} from './components/NavigationToolbarMobile';
import BottomNavigation, {BottomNavigationProps} from './components/BottomNavigation';
import BroadcastMessages, {BroadcastMessagesProps, BroadcastMessagesSkeleton} from './components/BroadcastMessages';
import Category, {CategoryProps, CategorySkeleton} from './components/Category';
import CategoryAutocomplete, {CategoryAutocompleteProps} from './components/CategoryAutocomplete';
import CategoryHeader, {CategoryHeaderProps, CategoryHeaderSkeleton} from './components/CategoryHeader';
import Categories, {CategoriesProps, CategoriesSkeleton, CategoriesSkeletonProps} from './components/Categories';
import CategoriesFollowed, {CategoriesFollowedSkeleton} from './components/CategoriesFollowed';
import CategoriesPopular, {CategoriesPopularSkeleton} from './components/CategoriesPopular';
import CategoriesSuggestion, {CategoriesListProps, CategoriesSuggestionSkeleton} from './components/CategoriesSuggestion';
import ChangeCover, {ChangeCoverProps} from './components/ChangeCover';
import ChangePicture, {ChangePictureProps} from './components/ChangePicture';
import FriendshipUserButton, {FriendshipButtonProps} from './components/FriendshipUserButton';
import Composer, {ComposerProps, ComposerSkeleton} from './components/Composer';
import ComposerIconButton, {ComposerIconButtonProps} from './components/ComposerIconButton';
import {COMPOSER_TYPE_DISCUSSION, COMPOSER_TYPE_POST} from './constants/Composer';
import Editor, {EditorProps, EditorSkeleton} from './components/Editor';
import User, {UserProps, UserSkeleton} from './components/User';
import Feed, {FeedProps, FeedRef, FeedSidebarProps, FeedSkeleton} from './components/Feed';
import FeedObject, {FeedObjectProps, FeedObjectSkeleton} from './components/FeedObject';
import FeedUpdates, {FeedUpdatesProps, FeedUpdatesSkeleton} from './components/FeedUpdates';
import FollowCategoryButton, {FollowCategoryButtonProps} from './components/FollowCategoryButton';
import FollowUserButton, {FollowUserButtonProps} from './components/FollowUserButton';
import ConnectionUserButton from './components/ConnectionUserButton';
import InlineComposer, {InlineComposerProps, InlineComposerSkeleton} from './components/InlineComposer';
import PeopleSuggestion, {PeopleSuggestionProps, PeopleSuggestionSkeleton} from './components/PeopleSuggestion';
import Platform, {PlatformProps, PlatformSkeleton} from './components/Platform';
import PrivateMessageSnippets, {PrivateMessageSnippetsProps, PrivateMessageSnippetsSkeleton} from './components/PrivateMessageSnippets';
import LocationAutocomplete, {LocationAutocompleteProps} from './components/LocationAutocomplete';
import LoyaltyProgram, {LoyaltyProgramProps, LoyaltyProgramSkeleton} from './components/LoyaltyProgram';
import LoyaltyProgramDetail, {LoyaltyProgramDetailProps, LoyaltyProgramDetailSkeleton} from './components/LoyaltyProgramDetail';
import TrendingFeed, {TrendingFeedProps, TrendingFeedSkeleton} from './components/TrendingFeed';
import TrendingPeople, {TrendingPeopleProps, TrendingPeopleSkeleton} from './components/TrendingPeople';
import UserActionIconButton, {UserActionIconButtonProps} from './components/UserActionIconButton';
import UserCounters, {UserCountersProps} from './components/UserCounters';
import UserProfileHeader, {UserProfileHeaderProps, UserProfileHeaderSkeleton} from './components/UserProfileHeader';
import UserInfoDialog, {UserInfoDialogProps} from './components/UserInfoDialog';
import UserInfo, {UserInfoProps, UserInfoSkeleton} from './components/UserInfo';
import UserProfileEdit, {
  UserProfileEditProps,
  UserProfileEditSectionPublicInfo,
  UserProfileEditSectionPublicInfoProps,
  UserProfileEditSectionSettings,
  UserProfileEditSectionSettingsProps,
  UserProfileEditSectionAccount,
  UserProfileEditSectionAccountProps
} from './components/UserProfileEdit';
import UsersFollowed, {UsersFollowedProps, UsersFollowedSkeleton} from './components/UsersFollowed';
import UserSocialAssociation, {UserSocialAssociationProps} from './components/UserSocialAssociation';
import UserFollowers, {UserFollowersProps, UserFollowersSkeleton} from './components/UserFollowers';
import RelatedFeedObjects, {RelatedFeedObjectsProps, RelatedFeedObjectsSkeleton} from './components/RelatedFeedObjects';
import CommentObject, {CommentObjectProps, CommentObjectSkeleton} from './components/CommentObject';
import CommentsObject, {CommentsObjectProps, CommentsObjectSkeleton} from './components/CommentsObject';
import CommentsFeedObject, {CommentsFeedObjectProps, CommentsFeedObjectSkeleton} from './components/CommentsFeedObject';
import ReplyComment from './components/CommentObject/ReplyComment';
import CustomAdv, {CustomAdvProps, CustomAdvSkeleton} from './components/CustomAdv';
import {AvatarGroupSkeleton, GenericSkeleton} from './components/Skeleton';
import PrivateMessageSnippetItem, {PrivateMessageSnippetItemProps, PrivateMessageSnippetItemSkeleton} from './components/PrivateMessageSnippetItem';
import PrivateMessageThreadItem, {PrivateMessageThreadItemProps, PrivateMessageThreadItemSkeleton} from './components/PrivateMessageThreadItem';
import PrivateMessageEditor, {PrivateMessageEditorProps, PrivateMessageEditorSkeleton} from './components/PrivateMessageEditor';
import PrivateMessageThread, {PrivateMessageThreadProps, PrivateMessageThreadSkeleton} from './components/PrivateMessageThread';
import ToastNotifications, {ToastNotificationsProps, ToastNotificationsSkeleton} from './components/ToastNotifications';
import SnippetNotifications, {SnippetNotificationsProps, SnippetNotificationsSkeleton} from './components/SnippetNotifications';
import Notification, {NotificationProps, NotificationSkeleton} from './components/Notification';
import AccountRecover, {AccountRecoverProps} from './components/AccountRecover';
import AccountReset, {AccountResetProps} from './components/AccountReset';
import AccountVerify, {AccountVerifyProps} from './components/AccountVerify';
import {
  SCBroadcastMessageTemplateType,
  SCCommentsOrderBy,
  SCFeedObjectActivitiesType,
  SCFeedObjectTemplateType,
  SCFeedWidgetType,
  SCMediaChunkType,
  SCMediaObjectType,
  SCNotificationObjectTemplateType,
  SCUserProfileFields,
  SCUserProfileSettings,
  SCUserSocialAssociations
} from './types';
import Widget from './components/Widget';
import ConfirmDialog from './shared/ConfirmDialog/ConfirmDialog';
import BaseItem, {BaseItemProps} from './shared/BaseItem';
import BaseDialog, {BaseDialogProps} from './shared/BaseDialog';
import MediaChunkUploader, {MediaChunkUploaderProps} from './shared/MediaChunkUploader';
import {Document, EditMediaProps, Image, Link, Share} from './shared/Media';
import UrlTextField from './shared/UrlTextField';
import UsernameTextField from './shared/UsernameTextField';
import EmailTextField from './shared/EmailTextField';
import PasswordTextField from './shared/PasswordTextField';
import PhoneTextField from './shared/PhoneTextField';
import StickyBox, {useStickyBox, StickyBoxProps, StickyBoxComponent, UseStickyBoxProps} from './shared/StickyBox';
import TagChip, {TagChipProps} from './shared/TagChip';
import {MEDIA_TYPE_EMBED} from './constants/Media';
import PollSuggestion, {PollSuggestionProps} from './components/PollSuggestion';
import ConsentSolution, {ConsentSolutionProps, ConsentSolutionSkeleton} from './components/ConsentSolution';
import ConsentSolutionButton, {ConsentSolutionButtonProps} from './components/ConsentSolutionButton';
import Incubator, {IncubatorProps} from './components/Incubator';
import IncubatorsList, {IncubatorsListProps} from './components/IncubatorsList';
import IncubatorDetail, {IncubatorDetailProps} from './components/IncubatorDetail';
import IncubatorSuggestion, {IncubatorSuggestionProps} from './components/IncubatorSuggestion';
import Footer, {FooterProps} from './components/Footer';
import SearchAutocomplete, {SearchAutocompleteProps} from './components/SearchAutocomplete';
import SearchDialog, {SearchDialogProps} from './components/SearchDialog';
import PrivateMessageActionMenu, {PrivateMessageActionMenuProps, PrivateMessageActionMenuSkeleton} from './components/PrivateMessageActionMenu';
import PrivateMessageActionDrawer, {
  PrivateMessageActionDrawerProps,
  PrivateMessageActionDrawerSkeleton
} from './components/PrivateMessageActionDrawer';
import PrivateMessageComponent, {PrivateMessageComponentProps, PrivateMessageComponentSkeleton} from './components/PrivateMessageComponent';
/**
 * Constants
 */
import {DEFAULT_WIDGETS_NUMBER} from './constants/Feed';
import {DEFAULT_PAGINATION_QUERY_PARAM_NAME, DEFAULT_PAGINATION_OFFSET, DEFAULT_PAGINATION_LIMIT} from './constants/Pagination';
import {FACEBOOK_SHARE, LINKEDIN_SHARE, TWITTER_SHARE} from './constants/SocialShare';
import {DEFAULT_PRELOAD_OFFSET_VIEWPORT, MAX_PRELOAD_OFFSET_VIEWPORT, MIN_PRELOAD_OFFSET_VIEWPORT} from './constants/LazyLoad';
import {LEGAL_POLICIES} from './constants/LegalPolicies';
import {DEFAULT_FIELDS} from './constants/UserProfile';

/**
 * Utilities:
 * contribute
 */
import * as ContributionUtils from './utils/contribution';
import MetadataField from './shared/MetadataField';
import InfiniteScroll from './shared/InfiniteScroll';
import CentralProgress from './shared/CentralProgress';
import {bytesToSize} from './utils/sizeCoverter';
import * as MessageUploaderUtils from './utils/thumbnailCoverter';

/**
 * List all exports
 */
export {
  AccountRecover,
  AccountRecoverProps,
  AccountReset,
  AccountResetProps,
  AccountVerify,
  AccountVerifyProps,
  NavigationSettingsIconButton,
  NavigationSettingsIconButtonProps,
  NavigationToolbarMobile,
  NavigationToolbarMobileProps,
  NavigationToolbarMobileSkeleton,
  NavigationToolbar,
  NavigationToolbarProps,
  NavigationToolbarSkeleton,
  BottomNavigation,
  BottomNavigationProps,
  BroadcastMessages,
  BroadcastMessagesProps,
  BroadcastMessagesSkeleton,
  Category,
  CategoryProps,
  CategorySkeleton,
  CategoryAutocomplete,
  CategoryAutocompleteProps,
  CategoryHeader,
  CategoryHeaderProps,
  CategoryHeaderSkeleton,
  Categories,
  CategoriesProps,
  CategoriesSkeleton,
  CategoriesSkeletonProps,
  CategoriesFollowed,
  CategoriesFollowedSkeleton,
  CategoriesPopular,
  CategoriesPopularSkeleton,
  CategoriesSuggestion,
  CategoriesListProps,
  CategoriesSuggestionSkeleton,
  ChangeCover,
  ChangePicture,
  ChangePictureProps,
  ChangeCoverProps,
  Composer,
  COMPOSER_TYPE_DISCUSSION,
  COMPOSER_TYPE_POST,
  ComposerProps,
  ComposerSkeleton,
  ComposerIconButton,
  ComposerIconButtonProps,
  Editor,
  EditorProps,
  EditorSkeleton,
  FriendshipUserButton,
  FriendshipButtonProps,
  Feed,
  FeedRef,
  FeedProps,
  FeedSidebarProps,
  FeedSkeleton,
  FollowCategoryButton,
  FollowCategoryButtonProps,
  FollowUserButton,
  FollowUserButtonProps,
  ConnectionUserButton,
  FeedObject,
  FeedObjectProps,
  FeedObjectSkeleton,
  FeedUpdates,
  FeedUpdatesProps,
  FeedUpdatesSkeleton,
  GenericSkeleton,
  AvatarGroupSkeleton,
  CommentObject,
  CommentsObject,
  CommentsObjectProps,
  CommentObjectProps,
  CommentsObjectSkeleton,
  CommentObjectSkeleton,
  CommentsFeedObject,
  CommentsFeedObjectProps,
  CommentsFeedObjectSkeleton,
  ReplyComment,
  InlineComposer,
  InlineComposerProps,
  InlineComposerSkeleton,
  Notification,
  NotificationProps,
  NotificationSkeleton,
  PeopleSuggestion,
  PeopleSuggestionProps,
  PeopleSuggestionSkeleton,
  Platform,
  PlatformProps,
  PlatformSkeleton,
  LocationAutocomplete,
  LocationAutocompleteProps,
  LoyaltyProgram,
  LoyaltyProgramProps,
  LoyaltyProgramSkeleton,
  LoyaltyProgramDetail,
  LoyaltyProgramDetailSkeleton,
  LoyaltyProgramDetailProps,
  TrendingFeed,
  TrendingFeedProps,
  TrendingFeedSkeleton,
  TrendingPeople,
  TrendingPeopleProps,
  TrendingPeopleSkeleton,
  RelatedFeedObjects,
  RelatedFeedObjectsProps,
  RelatedFeedObjectsSkeleton,
  UserActionIconButton,
  UserActionIconButtonProps,
  UserCounters,
  UserCountersProps,
  UserProfileHeader,
  UserProfileHeaderProps,
  UserProfileHeaderSkeleton,
  UserInfoDialog,
  UserInfoDialogProps,
  UserInfo,
  UserInfoProps,
  UserInfoSkeleton,
  SCUserProfileFields,
  SCUserProfileSettings,
  UserProfileEdit,
  UserProfileEditProps,
  UserProfileEditSectionPublicInfo,
  UserProfileEditSectionPublicInfoProps,
  UserProfileEditSectionSettings,
  UserProfileEditSectionSettingsProps,
  UserProfileEditSectionAccount,
  UserProfileEditSectionAccountProps,
  UsersFollowed,
  UsersFollowedProps,
  UsersFollowedSkeleton,
  UserFollowers,
  UserFollowersProps,
  UserFollowersSkeleton,
  UserSocialAssociation,
  UserSocialAssociationProps,
  SCUserSocialAssociations,
  CustomAdv,
  CustomAdvProps,
  CustomAdvSkeleton,
  User,
  UserProps,
  UserSkeleton,
  PrivateMessageThread,
  PrivateMessageThreadProps,
  PrivateMessageThreadSkeleton,
  PrivateMessageThreadItem,
  PrivateMessageThreadItemProps,
  PrivateMessageThreadItemSkeleton,
  PrivateMessageSnippetItem,
  PrivateMessageSnippetItemProps,
  PrivateMessageSnippetItemSkeleton,
  PrivateMessageEditor,
  PrivateMessageEditorProps,
  PrivateMessageEditorSkeleton,
  PrivateMessageSnippets,
  PrivateMessageSnippetsProps,
  PrivateMessageSnippetsSkeleton,
  PrivateMessageActionMenu,
  PrivateMessageActionMenuProps,
  PrivateMessageActionMenuSkeleton,
  PrivateMessageActionDrawer,
  PrivateMessageActionDrawerProps,
  PrivateMessageActionDrawerSkeleton,
  PrivateMessageComponent,
  PrivateMessageComponentProps,
  PrivateMessageComponentSkeleton,
  ToastNotifications,
  ToastNotificationsProps,
  ToastNotificationsSkeleton,
  SnippetNotifications,
  SnippetNotificationsProps,
  SnippetNotificationsSkeleton,
  SearchAutocomplete,
  SearchAutocompleteProps,
  SearchDialog,
  SearchDialogProps,
  Widget,
  SCFeedWidgetType,
  SCFeedObjectTemplateType,
  SCCommentsOrderBy,
  SCFeedObjectActivitiesType,
  SCMediaObjectType,
  SCMediaChunkType,
  SCNotificationObjectTemplateType,
  SCBroadcastMessageTemplateType,
  /* SC UI SHARED */
  UrlTextField,
  UsernameTextField,
  EmailTextField,
  PasswordTextField,
  PhoneTextField,
  MetadataField,
  InfiniteScroll,
  StickyBox,
  useStickyBox,
  StickyBoxProps,
  StickyBoxComponent,
  UseStickyBoxProps,
  TagChip,
  TagChipProps,
  CentralProgress,
  ConfirmDialog,
  MediaChunkUploader,
  MediaChunkUploaderProps,
  Document,
  Image,
  Link,
  Share,
  EditMediaProps,
  MEDIA_TYPE_EMBED,
  FACEBOOK_SHARE,
  TWITTER_SHARE,
  LINKEDIN_SHARE,
  DEFAULT_PRELOAD_OFFSET_VIEWPORT,
  MIN_PRELOAD_OFFSET_VIEWPORT,
  MAX_PRELOAD_OFFSET_VIEWPORT,
  /* SC CONSENT SOLUTION */
  ConsentSolution,
  ConsentSolutionProps,
  ConsentSolutionSkeleton,
  ConsentSolutionButton,
  ConsentSolutionButtonProps,
  LEGAL_POLICIES,
  DEFAULT_FIELDS,
  /* SC UI PAGINATION */
  DEFAULT_PAGINATION_QUERY_PARAM_NAME,
  DEFAULT_PAGINATION_OFFSET,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_WIDGETS_NUMBER,
  PollSuggestion,
  PollSuggestionProps,
  Incubator,
  IncubatorProps,
  IncubatorsList,
  IncubatorsListProps,
  IncubatorDetail,
  IncubatorDetailProps,
  IncubatorSuggestion,
  IncubatorSuggestionProps,
  ContributionUtils,
  bytesToSize,
  MessageUploaderUtils,
  Footer,
  FooterProps,
  BaseItem,
  BaseItemProps,
  BaseDialog,
  BaseDialogProps
};
