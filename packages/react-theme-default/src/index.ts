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
import SCFeedObjectMediaPreview from './components/SCFeedObjectMediaPreview';
import SCFeed from './components/SCFeed';
import MuiButton from './components/MuiButton';
import MuiAvatar from './components/MuiAvatar';
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
import SCCommentObjectReply from './components/SCCommentObjectReply';
import SCCustomSnackMessage from './components/SCCustomSnackMessage';
import MuiContainer from './components/MuiContainer';
import SCLoyaltyProgramDetailTemplate from './components/SCLoyaltyProgramDetailTemplate';
import SCPrivateMessageComponent from './components/SCPrivateMessageComponent';
import MuiDialog from './components/MuiDialog';
import SCCategories from './components/SCCategories';
import MuiIcon from './components/MuiIcon';
import SCCategory from './components/SCCategory';
import SCDateTimeAgo from './components/SCDateTimeAgo';
import MuiIconButton from './components/MuiIconButton';
import SCUser from './components/SCUser';
import SCLoyaltyProgramWidget from './components/SCLoyaltyProgramWidget';
import MuiOutlinedInput from './components/MuiOutlinedInput';
import MuiSelect from './components/MuiSelect';
import SCCategoryAutocomplete from './components/SCCategoryAutocomplete';
import MuiAutocomplete from './components/MuiAutocomplete';
import SCPreviewMediaDocument from './components/SCPreviewMediaDocument';
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
import SCNotificationItem from './components/SCNotificationItem';
import SCNotification from './components/SCNotification';
import SCLightbox from './components/SCLightbox';
import SCReactionAction from './components/SCReactionAction';
import MuiTooltip from './components/MuiTooltip';
import MuiPopover from './components/MuiPopover';
import SCUserActionIconButton from './components/SCUserActionIconButton';
import SCNavigationSettingsIconButton from './components/SCNavigationSettingsIconButton';
import SCUserInfo from './components/SCUserInfo';
import SCUserCounters from './components/SCUserCounters';
import SCUserProfileEdit from './components/SCUserProfileEdit';
import SCUserProfileBlocked from './components/SCUserProfileBlocked';
import SCVoteButton from './components/SCVoteButton';
import SCVoteAudienceButton from './components/SCVoteAudienceButton';
import SCFooter from './components/SCFooter';
import SCPlatformWidget from './components/SCPlatformWidget';
import SCChangePictureButton from './components/SCChangePictureButton';
import SCCategoryFollowersButton from './components/SCCategoryFollowersButton';
import SCFeedUpdatesWidget from './components/SCFeedUpdatesWidget';
import SCIncubator from './components/SCIncubator';
import SCIncubatorListWidget from './components/SCIncubatorListWidget';
import SCIncubatorSuggestionWidget from './components/SCIncubatorSuggestionWidget';
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
import SCExploreFeedTemplate from './components/SCExploreFeedTemplate';
import SCMainFeedTemplate from './components/SCMainFeedTemplate';
import SCNotificationFeedTemplate from './components/SCNotificationFeedTemplate';
import SCUserFeedTemplate from './components/SCUserFeedTemplate';
import SCChangeCoverButton from './components/SCChangeCoverButton';
import SCPrivateMessageSettingsIconButton from './components/SCPrivateMessageSettingsIconButton';
import SCLanguageSwitcher from './components/SCLanguageSwitcher';
import SCGroupHeader from './components/SCGroupHeader';
import SCChangeGroupCoverButton from './components/SCChangeGroupCoverButton';
import SCChangeGroupPictureButton from './components/SCChangeGroupPictureButton';
import SCGroupMembersButton from './components/SCGroupMembersButton';
import SCCreateGroupButton from './components/SCCreateGroupButton';
import SCGroupForm from './components/SCGroupForm';
import SCGroupInviteButton from './components/SCGroupInviteButton';
import SCGroupInfoWidget from './components/SCGroupInfoWidget';
import SCGroup from './components/SCGroup';
import SCGroupTemplate from './components/SCGroupTemplate';
import SCGroupFeedTemplate from './components/SCGroupFeedTemplate';
import SCGroupMembersWidget from './components/SCGroupMembersWidget';
import SCGroupRequestsWidget from './components/SCGroupRequestsWidget';
import SCGroups from './components/SCGroups';
import SCEditGroupButton from './components/SCEditGroupButton';
import SCGroupAutocomplete from './components/SCGroupAutocomplete';
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
    h1: {
      fontSize: '3.4rem'
    },
    h2: {
      fontSize: '1.7rem'
    },
    h3: {
      fontSize: '1.5rem'
    },
    h4: {
      fontSize: '1.2rem'
    },
    h5: {
      fontSize: '1.1rem'
    },
    h6: {
      fontSize: '1rem'
    },
    body1: {
      fontSize: '1rem'
    }
  },
  shape: {
    borderRadius: 20,
    borderRadiusSm: 10
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
    SCChoices,
    SCCommentObject,
    SCCommentObjectReply,
    SCCommentsFeedObject,
    SCCommentsObject,
    SCComposer,
    SCCategoryAutocomplete,
    SCContributionActionsMenu,
    SCCustomSnackMessage,
    SCDateTimeAgo,
    SCEditor,
    SCEmojiPicker,
    SCFeed,
    SCFeedObject,
    SCFeedObjectMediaPreview,
    SCFeedObjectDetailTemplate,
    SCFeedUpdatesWidget,
    SCFooter,
    SCInlineComposerWidget,
    SCLanguageSwitcher,
    SCLightbox,
    SCLoyaltyProgramWidget,
    SCLoyaltyProgramDetailTemplate,
    SCMediaFile,
    SCMediaLink,
    SCNavigationSettingsIconButton,
    SCNavigationToolbar,
    SCNavigationToolbarMobile,
    SCNotification,
    SCNotificationItem,
    SCPreviewMediaDocument,
    SCPreviewMediaLink,
    SCPrivateMessageComponent,
    SCReactionAction,
    SCScrollContainer,
    SCSearchAutocomplete,
    SCSnippetNotifications,
    SCUser,
    SCUserActionIconButton,
    SCUserCounters,
    SCUserProfileBlocked,
    SCUserInfo,
    SCUserProfileHeader,
    SCUserProfileEdit,
    SCUserProfileTemplate,
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
    SCUserSuggestionWidget,
    SCExploreFeedTemplate,
    SCMainFeedTemplate,
    SCNotificationFeedTemplate,
    SCUserFeedTemplate,
    SCChangeCoverButton,
    SCPrivateMessageSettingsIconButton,
    SCGroupHeader,
    SCChangeGroupCoverButton,
    SCChangeGroupPictureButton,
    SCGroupMembersButton,
    SCCreateGroupButton,
    SCGroupForm,
    SCGroupInviteButton,
    SCGroupInfoWidget,
    SCGroup,
    SCGroupTemplate,
    SCGroupFeedTemplate,
    SCGroupMembersWidget,
    SCGroupRequestsWidget,
    SCGroups,
    SCEditGroupButton,
    SCGroupAutocomplete
  },
  selfcommunity: {
    user: {
      avatar: {
        sizeSmall: 21,
        sizeMedium: 30,
        sizeLarge: 60,
        sizeXLarge: 90
      }
    },
    category: {
      icon: {
        sizeSmall: 24,
        sizeMedium: 40,
        sizeLarge: 50
      }
    },
    group: {
      avatar: {
        sizeSmall: 40,
        sizeMedium: 60,
        sizeLarge: 90,
        sizeXLarge: 120
      }
    }
  }
};
export default theme;
