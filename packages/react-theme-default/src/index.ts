import './fonts/community-icons.css';
import './styles/reset.css';

/**
 * Style fragments - Imports - Start
 */
import MuiAppBar from './components/MuiAppBar';
import MuiAutocomplete from './components/MuiAutocomplete';
import MuiAvatar from './components/MuiAvatar';
import MuiButton from './components/MuiButton';
import MuiContainer from './components/MuiContainer';
import MuiDialog from './components/MuiDialog';
import MuiDrawer from './components/MuiDrawer';
import MuiIcon from './components/MuiIcon';
import MuiIconButton from './components/MuiIconButton';
import MuiOutlinedInput from './components/MuiOutlinedInput';
import MuiPopover from './components/MuiPopover';
import MuiSelect from './components/MuiSelect';
import MuiTooltip from './components/MuiTooltip';
import SCAccountChangeMailValidation from './components/SCAccountChangeMailValidation';
import SCAccountDataPortability from './components/SCAccountDataPortability';
import SCAccountDelete from './components/SCAccountDelete';
import SCAccountReset from './components/SCAccountReset';
import SCAccountVerify from './components/SCAccountVerify';
import SCBaseDialog from './components/SCBaseDialog';
import SCBaseItem from './components/SCBaseItem';
import SCBaseItemButton from './components/SCBaseItemButton';
import SCBottomNavigation from './components/SCBottomNavigation';
import SCBroadcastMessages from './components/SCBroadcastMessages';
import SCBullet from './components/SCBullet';
import SCCalendar from './components/SCCalendar';
import SCCategories from './components/SCCategories';
import SCCategoriesPopularWidget from './components/SCCategoriesPopularWidget';
import SCCategoriesSuggestionWidget from './components/SCCategoriesSuggestionWidget';
import SCCategory from './components/SCCategory';
import SCCategoryAutocomplete from './components/SCCategoryAutocomplete';
import SCCategoryFeedTemplate from './components/SCCategoryFeedTemplate';
import SCCategoryFollowersButton from './components/SCCategoryFollowersButton';
import SCCategoryHeader from './components/SCCategoryHeader';
import SCCategoryTemplate from './components/SCCategoryTemplate';
import SCCategoryTrendingFeedWidget from './components/SCCategoryTrendingFeedWidget';
import SCCategoryTrendingUsersWidget from './components/SCCategoryTrendingUsersWidget';
import SCChangeCoverButton from './components/SCChangeCoverButton';
import SCChangeGroupCoverButton from './components/SCChangeGroupCoverButton';
import SCChangeGroupPictureButton from './components/SCChangeGroupPictureButton';
import SCChangePictureButton from './components/SCChangePictureButton';
import SCChoices from './components/SCChoices';
import SCCommentObject from './components/SCCommentObject';
import SCCommentObjectReply from './components/SCCommentObjectReply';
import SCCommentsFeedObject from './components/SCCommentsFeedObject';
import SCCommentsObject from './components/SCCommentsObject';
import SCComposer from './components/SCComposer';
import SCConsentSolution from './components/SCConsentSolution';
import SCContributionActionsMenu from './components/SCContributionActionsMenu';
import SCCreateEventButton from './components/SCCreateEventButton';
import SCCreateGroupButton from './components/SCCreateGroupButton';
import SCCustomAdv from './components/SCCustomAdv';
import SCCustomSnackMessage from './components/SCCustomSnackMessage';
import SCDateTimeAgo from './components/SCDateTimeAgo';
import SCDefaultHeaderContent from './components/SCDefaultHeaderContent';
import SCEditGroupButton from './components/SCEditGroupButton';
import SCEditor from './components/SCEditor';
import SCEmojiPicker from './components/SCEmojiPicker';
import SCEvent from './components/SCEvent';
import SCEventForm from './components/SCEventForm';
import SCEventHeader from './components/SCEventHeader';
import SCEventInfoDetails from './components/SCEventInfoDetails';
import SCEventInfoWidget from './components/SCEventInfoWidget';
import SCEventInviteButton from './components/SCEventInviteButton';
import SCEventLocationWidget from './components/SCEventLocationWidget';
import SCEventPartecipantsButton from './components/SCEventPartecipantsButton';
import SCEvents from './components/SCEvents';
import SCEventSubscribeButton from './components/SCEventSubscribeButton';
import SCExploreFeedTemplate from './components/SCExploreFeedTemplate';
import SCFeed from './components/SCFeed';
import SCFeedObject from './components/SCFeedObject';
import SCFeedObjectDetailTemplate from './components/SCFeedObjectDetailTemplate';
import SCFeedObjectMediaPreview from './components/SCFeedObjectMediaPreview';
import SCFeedUpdatesWidget from './components/SCFeedUpdatesWidget';
import SCFooter from './components/SCFooter';
import SCGroup from './components/SCGroup';
import SCGroupAutocomplete from './components/SCGroupAutocomplete';
import SCGroupFeedTemplate from './components/SCGroupFeedTemplate';
import SCGroupForm from './components/SCGroupForm';
import SCGroupHeader from './components/SCGroupHeader';
import SCGroupInfoWidget from './components/SCGroupInfoWidget';
import SCGroupInviteButton from './components/SCGroupInviteButton';
import SCGroupInvitedWidget from './components/SCGroupInvitedWidget';
import SCGroupMembersButton from './components/SCGroupMembersButton';
import SCGroupMembersWidget from './components/SCGroupMembersWidget';
import SCGroupRequestsWidget from './components/SCGroupRequestsWidget';
import SCGroups from './components/SCGroups';
import SCGroupSettingsIconButton from './components/SCGroupSettingsIconButton';
import SCGroupTemplate from './components/SCGroupTemplate';
import SCIncubator from './components/SCIncubator';
import SCIncubatorDetail from './components/SCIncubatorDetail';
import SCIncubatorListWidget from './components/SCIncubatorListWidget';
import SCIncubatorSuggestionWidget from './components/SCIncubatorSuggestionWidget';
import SCInlineComposerWidget from './components/SCInlineComposerWidget';
import SCLanguageSwitcher from './components/SCLanguageSwitcher';
import SCLightbox from './components/SCLightbox';
import SCLoyaltyProgramDetailTemplate from './components/SCLoyaltyProgramDetailTemplate';
import SCLoyaltyProgramWidget from './components/SCLoyaltyProgramWidget';
import SCMainFeedTemplate from './components/SCMainFeedTemplate';
import SCMediaFile from './components/SCMediaFile';
import SCMediaLink from './components/SCMediaLink';
import SCMyEventsWidget from './components/SCMyEventsWidget';
import SCNavigationMenuIconButton from './components/SCNavigationMenuIconButton';
import SCNavigationSettingsIconButton from './components/SCNavigationSettingsIconButton';
import SCNavigationToolbar from './components/SCNavigationToolbar';
import SCNavigationToolbarMobile from './components/SCNavigationToolbarMobile';
import SCNotification from './components/SCNotification';
import SCNotificationFeedTemplate from './components/SCNotificationFeedTemplate';
import SCNotificationItem from './components/SCNotificationItem';
import SCPlatformWidget from './components/SCPlatformWidget';
import SCPollSuggestionWidget from './components/SCPollSuggestionWidget';
import SCPreviewMediaDocument from './components/SCPreviewMediaDocument';
import SCPreviewMediaLink from './components/SCPreviewMediaLink';
import SCPrivateMessageComponent from './components/SCPrivateMessageComponent';
import SCPrivateMessageEditor from './components/SCPrivateMessageEditor';
import SCPrivateMessageSettingsIconButton from './components/SCPrivateMessageSettingsIconButton';
import SCPrivateMessageSnippetItem from './components/SCPrivateMessageSnippetItem';
import SCPrivateMessageSnippets from './components/SCPrivateMessageSnippets';
import SCPrivateMessageThread from './components/SCPrivateMessageThread';
import SCPrivateMessageThreadItem from './components/SCPrivateMessageThreadItem';
import SCReactionAction from './components/SCReactionAction';
import SCRelatedFeedObjectsWidget from './components/SCRelatedFeedObjectsWidget';
import SCScrollContainer from './components/SCScrollContainer';
import SCSearchAutocomplete from './components/SCSearchAutocomplete';
import SCSnippetNotifications from './components/SCSnippetNotifications';
import SCToastNotifications from './components/SCToastNotifications';
import SCUser from './components/SCUser';
import SCUserActionIconButton from './components/SCUserActionIconButton';
import SCUserAvatar from './components/SCUserAvatar';
import SCUserCategoriesFollowedWidget from './components/SCUserCategoriesFollowedWidget';
import SCUserConnectionsRequestsSentWidget from './components/SCUserConnectionsRequestsSentWidget';
import SCUserConnectionsRequestsWidget from './components/SCUserConnectionsRequestsWidget';
import SCUserConnectionsWidget from './components/SCUserConnectionsWidget';
import SCUserCounters from './components/SCUserCounters';
import SCUserFeedTemplate from './components/SCUserFeedTemplate';
import SCUserFollowedUsersWidget from './components/SCUserFollowedUsersWidget';
import SCUserFollowersWidget from './components/SCUserFollowersWidget';
import SCUserInfo from './components/SCUserInfo';
import SCUserProfileBlocked from './components/SCUserProfileBlocked';
import SCUserProfileEdit from './components/SCUserProfileEdit';
import SCUserProfileHeader from './components/SCUserProfileHeader';
import SCUserProfileTemplate from './components/SCUserProfileTemplate';
import SCUserSubscribedGroupsWidget from './components/SCUserSubscribedGroupsWidget';
import SCUserSuggestionWidget from './components/SCUserSuggestionWidget';
import SCVoteAudienceButton from './components/SCVoteAudienceButton';
import SCVoteButton from './components/SCVoteButton';
import SCWidget from './components/SCWidget';
/**
 * Style fragments - Imports - End
 */

/**
 * Export default theme
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
    SCDefaultHeaderContent,
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
    SCGroupAutocomplete,
    SCGroupSettingsIconButton,
    SCGroupInvitedWidget,
    SCUserSubscribedGroupsWidget,
    SCEventForm,
    SCCreateEventButton,
    SCEventLocationWidget,
    SCEvent,
    SCEvents,
    SCEventInviteButton,
    SCEventHeader,
    SCEventInfoWidget,
    SCEventInfoDetails,
    SCEventSubscribeButton,
    SCEventPartecipantsButton,
    SCMyEventsWidget,
    SCCalendar
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
        sizeXLarge: 205
      }
    }
  }
};
export default theme;
