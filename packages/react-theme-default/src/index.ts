import './styles/reset.css';
import './fonts/community-icons.css';

/**
 * Style fragments - Imports - Start
 */
import SCWidget from './components/SCWidget';
import SCBaseDialog from './components/SCBaseDialog';
import SCInlineComposerWidget from './components/SCInlineComposerWidget';
import SCEditor from './components/SCEditor';
import SCCommentsObject from './components/SCCommentsObject';
import SCCommentsFeedObject from './components/SCCommentsFeedObject';
import SCBroadcastMessages from './components/SCBroadcastMessages';
import SCSnippetNotifications from './components/SCSnippetNotifications';
import SCScrollContainer from './components/SCScrollContainer';
import SCFeedObject from './components/SCFeedObject';
import SCFeed from './components/SCFeed';
import MuiButton from './components/MuiButton';
import MuiAvatar from './components/MuiAvatar';
import SCContributorsFeedObject from './components/SCContributorsFeedObject';
import SCContributionActionsMenu from './components/SCContributionActionsMenu';
import SCBaseItem from './components/SCBaseItem';
import SCCategoryHeader from './components/SCCategoryHeader';
import SCCategoryFeedTemplate from './components/SCCategoryFeedTemplate';
import SCBaseItemButton from './components/SCBaseItemButton';
import SCUserProfileHeader from './components/SCUserProfileHeader';
import SCCategoryTemplate from './components/SCCategoryTemplate';
import SCUserProfileTemplate from './components/SCUserProfileTemplate';
import SCFeedObjectDetailTemplate from './components/SCFeedObjectDetailTemplate';
import SCCommentObject from './components/SCCommentObject';
import SCFeedObjectDetailTemplateSkeleton from './components/SCFeedObjectDetailTemplateSkeleton';
import SCCustomSnackMessage from './components/SCCustomSnackMessage';
import SCCategoryTemplateSkeleton from './components/SCCategoryTemplateSkeleton';
import SCPollObject from './components/SCPollObject';
import SCFeedObjectSkeleton from './components/SCFeedObjectSkeleton';
import SCFeedSkeleton from './components/SCFeedSkeleton';
import MuiContainer from './components/MuiContainer';
import SCLoyaltyProgramDetailTemplate from './components/SCLoyaltyProgramDetailTemplate';
import SCLoyaltyProgramDetailTemplateSkeleton from './components/SCLoyaltyProgramDetailTemplateSkeleton';
import SCPrivateMessageComponent from './components/SCPrivateMessageComponent';
import MuiDialog from './components/MuiDialog';
import SCCategories from './components/SCCategories';
import MuiIcon from './components/MuiIcon';
import SCCategory from './components/SCCategory';
import SCDateTimeAgo from './components/SCDateTimeAgo';
import SCFeedRelevantActivities from './components/SCFeedRelevantActivities';
import MuiIconButton from './components/MuiIconButton';
import SCUser from './components/SCUser';
import SCLoyaltyProgramWidget from './components/SCLoyaltyProgramWidget';
import MuiOutlinedInput from './components/MuiOutlinedInput';
import MuiSelect from './components/MuiSelect';
import SCCategoryAutocomplete from './components/SCCategoryAutocomplete';
import MuiAutocomplete from './components/MuiAutocomplete';
import SCPreviewMediaDocument from './components/SCPreviewMediaDocument';
import SCCommentObjectSkeleton from './components/SCCommentObjectSkeleton';
import SCChoices from './components/SCChoices';
import SCNavigationToolbar from './components/SCNavigationToolbar';
import SCSearchAutocomplete from './components/SCSearchAutocomplete';
import SCNavigationToolbarMobile from './components/SCNavigationToolbarMobile';
import SCBottomNavigation from './components/SCBottomNavigation';
import MuiAppBar from './components/MuiAppBar';
import SCPrivateMessageSnippetItem from './components/SCPrivateMessageSnippetItem';
import SCPrivateMessageThread from './components/SCPrivateMessageThread';
import SCPrivateMessageThreadItem from './components/SCPrivateMessageThreadItem';
import SCPrivateMessageSnippets from './components/SCPrivateMessageSnippets';
import SCPrivateMessageEditor from './components/SCPrivateMessageEditor';
import SCNotificationsMenu from './components/SCNotificationsMenu';
import SCNotificationItem from './components/SCNotificationItem';
import SCNotification from './components/SCNotification';
import SCContributionNotification from './components/SCContributionNotification';
import SCLightbox from './components/SCLightbox';
import SCFollowAction from './components/SCFollowAction';
import SCReactionAction from './components/SCReactionAction';
import SCCommentAction from './components/SCCommentAction';
import SCShareAction from './components/SCShareAction';
import SCVoteAction from './components/SCVoteAction';
import SCCommentObjectVotes from './components/SCCommentObjectVotes';
import SCActivitiesMenu from './components/SCActivitiesMenu';
import MuiTooltip from './components/MuiTooltip';
import SCCommentNotification from './components/SCCommentNotification';
import MuiPopover from './components/MuiPopover';
import SCUserActionIconButton from './components/SCUserActionIconButton';
import SCNavigationSettingsIconButton from './components/SCNavigationSettingsIconButton';
import SCUserInfo from './components/SCUserInfo';
import SCUserCounters from './components/SCUserCounters';
import SCUserProfileEdit from './components/SCUserProfileEdit';
import SCUserProfileBlocked from './components/SCUserProfileBlocked';
import SCVoteButton from './components/SCVoteButton';
import SCVoteAudienceButton from './components/SCVoteAudienceButton';
import SCEditorToolbarPlugin from './components/SCEditorToolbarPlugin';
import SCEditorFloatingLinkPlugin from './components/SCEditorFloatingLinkPlugin';
import SCCommentObjectReply from './components/SCCommentObjectReply';
import SCFooter from './components/SCFooter';
import SCPlatformWidget from './components/SCPlatformWidget';
import SCChangePictureButton from './components/SCChangePictureButton';
import SCEditorMentionPlugin from './components/SCEditorMentionPlugin';
import SCEditorHashtagPlugin from './components/SCEditorHashtagPlugin';
import SCCategoryFollowersButton from './components/SCCategoryFollowersButton';
import SCFeedUpdatesWidget from './components/SCFeedUpdatesWidget';
import SCIncubator from './components/SCIncubator';
import SCIncubatorListWidget from './components/SCIncubatorListWidget';
import SCIncubatorSuggestionWidget from './components/SCIncubatorSuggestionWidget';
import SCPrizeItemSkeleton from './components/SCPrizeItemSkeleton';
import SCIncubatorDetail from './components/SCIncubatorDetail';
import MuiDrawer from './components/MuiDrawer';
import SCEmojiPicker from './components/SCEmojiPicker';
import SCBullet from './components/SCBullet';
import SCAccountDataPortability from './components/SCAccountDataPortability';
import SCAccountDelete from './components/SCAccountDelete';
import SCNavigationMenuIconButton from './components/SCNavigationMenuIconButton';
import SCPreviewMediaLink from './components/SCPreviewMediaLink';
import SCUserAvatar from './components/SCUserAvatar';
import SCAccountReset from './components/SCAccountReset';
import SCAccountChangeMailValidation from './components/SCAccountChangeMailValidation';
import SCAccountVerify from './components/SCAccountVerify';
import SCNavigationToolbarSkeleton from './components/SCNavigationToolbarSkeleton';
import SCComposer from './components/SCComposer';
import SCMediaLink from './components/SCMediaLink';
import SCMediaFile from './components/SCMediaFile';
import SCCategoriesPopularWidget from './components/SCCategoriesPopularWidget';
import SCCategoriesSuggestionWidget from './components/SCCategoriesSuggestionWidget';
import SCCategoryTrendingFeedWidget from './components/SCCategoryTrendingFeedWidget';
import SCCategoryTrendingUsersWidget from './components/SCCategoryTrendingUsersWidget';
import SCConsentSolution from './components/SCConsentSolution';
import SCCustomAdv from './components/SCCustomAdv';
import SCPollSuggestionWidget from './components/SCPollSuggestionWidget';
import SCRelatedFeedObjectsWidget from './components/SCRelatedFeedObjectsWidget';
import SCToastNotifications from './components/SCToastNotifications';
import SCUserConnectionsRequestsSentWidget from './components/SCUserConnectionsRequestsSentWidget';
import SCUserConnectionsRequestsWidget from './components/SCUserConnectionsRequestsWidget';
import SCUserConnectionsWidget from './components/SCUserConnectionsWidget';
import SCUserCategoriesFollowedWidget from './components/SCUserCategoriesFollowedWidget';
import SCUserFollowedUsersWidget from './components/SCUserFollowedUsersWidget';
import SCUserFollowersWidget from './components/SCUserFollowersWidget';
import SCUserSuggestionWidget from './components/SCUserSuggestionWidget';

/**
 * Style fragments - Imports - End
 */

const theme = {
  // palette: {
  //   background: {
  //     default: '#FFFFFF'
  //   },
  //   text: {
  //     primary: 'rgba(0,0,0,0.8)'
  //   },
  //   primary: {
  //     main: '#546E7A'
  //   },
  //   secondary: {
  //     main: '#008080'
  //   }
  // },
  typography: {
    htmlFontSize: 14,
    fontSize: 14,
    // fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    fontWeightLight: '300',
    fontWeightRegular: '400',
    fontWeightMedium: '500',
    fontWeightBold: '700',
    body1: {
      fontSize: '1rem'
    }
  },
  shape: {
    borderRadius: 20
  },
  spacing: 8,
  mixins: {
    toolbar: {
      minHeight: 45,
      '@media (min-width:0px)': {
        minHeight: 45
      },
      '@media (min-width:600px)': {
        minHeight: 45
      }
    }
  },
  components: {
    MuiAppBar,
    MuiAutocomplete,
    MuiAvatar,
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    MuiButton,
    MuiContainer,
    MuiDialog,
    MuiDrawer,
    MuiIcon,
    MuiIconButton,
    MuiOutlinedInput,
    MuiPopover,
    MuiSelect,
    MuiTooltip,
    SCAccountChangeMailValidation,
    SCAccountDataPortability,
    SCAccountDelete,
    SCAccountReset,
    SCAccountVerify,
    SCActivitiesMenu,
    SCBaseDialog,
    SCBaseItem,
    SCBaseItemButton,
    SCBottomNavigation,
    SCBroadcastMessages,
    SCBullet,
    SCCategories,
    SCCategory,
    SCCategoryFeedTemplate,
    SCCategoryFollowersButton,
    SCCategoryHeader,
    SCCategoryTemplate,
    SCCategoryTemplateSkeleton,
    SCChoices,
    SCCommentAction,
    SCCommentNotification,
    SCCommentObject,
    SCCommentObjectReply,
    SCCommentObjectSkeleton,
    SCCommentObjectVotes,
    SCCommentsFeedObject,
    SCCommentsObject,
    SCComposer,
    SCCategoryAutocomplete,
    SCContributionNotification,
    SCContributorsFeedObject,
    SCContributionActionsMenu,
    SCCustomSnackMessage,
    SCDateTimeAgo,
    SCEditor,
    SCEditorFloatingLinkPlugin,
    SCEditorHashtagPlugin,
    SCEditorMentionPlugin,
    SCEditorToolbarPlugin,
    SCEmojiPicker,
    SCFeed,
    SCFeedObject,
    SCFeedObjectDetailTemplate,
    SCFeedObjectDetailTemplateSkeleton,
    SCFeedObjectSkeleton,
    SCFeedRelevantActivities,
    SCFeedSkeleton,
    SCFeedUpdatesWidget,
    SCFollowAction,
    SCFooter,
    SCInlineComposerWidget,
    SCLightbox,
    SCLoyaltyProgramWidget,
    SCLoyaltyProgramDetailTemplate,
    SCLoyaltyProgramDetailTemplateSkeleton,
    SCMediaFile,
    SCMediaLink,
    SCNavigationSettingsIconButton,
    SCNavigationToolbar,
    SCNavigationToolbarSkeleton,
    SCNavigationToolbarMobile,
    SCNotification,
    SCNotificationItem,
    SCNotificationsMenu,
    SCPollObject,
    SCPreviewMediaDocument,
    SCPreviewMediaLink,
    SCPrivateMessageComponent,
    SCReactionAction,
    SCScrollContainer,
    SCSearchAutocomplete,
    SCShareAction,
    SCSnippetNotifications,
    SCUser,
    SCUserActionIconButton,
    SCUserCounters,
    SCUserProfileBlocked,
    SCUserInfo,
    SCUserProfileHeader,
    SCUserProfileEdit,
    SCUserProfileTemplate,
    SCVoteAction,
    SCVoteButton,
    SCVoteAudienceButton,
    SCWidget,
    SCPrivateMessageSnippetItem,
    SCPrivateMessageSnippets,
    SCPrivateMessageThread,
    SCPrivateMessageThreadItem,
    SCPrivateMessageEditor,
    SCPlatformWidget,
    SCChangePictureButton,
    SCIncubator,
    SCIncubatorListWidget,
    SCIncubatorSuggestionWidget,
    SCIncubatorDetail,
    SCPrizeItemSkeleton,
    SCNavigationMenuIconButton,
    SCUserAvatar,
    SCCategoriesPopularWidget,
    SCCategoriesSuggestionWidget,
    SCCategoryTrendingFeedWidget,
    SCCategoryTrendingUsersWidget,
    SCConsentSolution,
    SCCustomAdv,
    SCPollSuggestionWidget,
    SCRelatedFeedObjectsWidget,
    SCToastNotifications,
    SCUserConnectionsRequestsSentWidget,
    SCUserConnectionsRequestsWidget,
    SCUserConnectionsWidget,
    SCUserCategoriesFollowedWidget,
    SCUserFollowedUsersWidget,
    SCUserFollowersWidget,
    SCUserSuggestionWidget
  },
  selfcommunity: {
    user: {
      avatar: {
        sizeSmall: 21,
        sizeMedium: 30,
        sizeLarge: 60,
        sizeXLarge: 140
      }
    },
    category: {
      icon: {
        sizeSmall: 24,
        sizeMedium: 40,
        sizeLarge: 50
      }
    }
  }
};
export default theme;
