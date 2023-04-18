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
import SCComposer from './components/SCComposer';
import SCBroadcastMessages from './components/SCBroadcastMessages';
import SCSnippetNotifications from './components/SCSnippetNotifications';
import SCScrollContainer from './components/SCScrollContainer';
import SCFeedObject from './components/SCFeedObject';
import SCFeed from './components/SCFeed';
import MuiButton from './components/MuiButton';
import MuiAvatar from './components/MuiAvatar';
import SCContributorsFeedObject from './components/SCContributorsFeedObject';
import SCBaseItem from './components/SCBaseItem';
import SCCategoryHeader from './components/SCCategoryHeader';
import SCCategoryFeedTemplate from './components/SCCategoryFeedTemplate';
import SCCategoriesSkeleton from './components/SCCategoriesSkeleton';
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
import SCLoyaltyProgramDetail from './components/SCLoyaltyProgramDetail';
import SCLoyaltyProgramDetailSkeleton from './components/SCLoyaltyProgramDetailSkeleton';
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
import SCLoyaltyProgramWidgetSkeleton from './components/SCLoyaltyProgramWidgetSkeleton';
import MuiOutlinedInput from './components/MuiOutlinedInput';
import MuiSelect from './components/MuiSelect';
import SCCategoryAutocomplete from './components/SCCategoryAutocomplete';
import MuiAutocomplete from './components/MuiAutocomplete';
import SCComposerPoll from './components/SCComposerPoll';
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
import SCSnippetNotificationsSkeleton from './components/SCSnippetNotificationsSkeleton';
import SCPrivateMessageComponentSkeleton from './components/SCPrivateMessageComponentSkeleton';
import SCPrivateMessageThreadSkeleton from './components/SCPrivateMessageThreadSkeleton';
import SCPrivateMessageThreadItemDialog from './components/SCPrivateMessageThreadItemDialog';
import SCLightbox from './components/SCLightbox';
import SCFollowAction from './components/SCFollowAction';
import SCReactionAction from './components/SCReactionAction';
import SCCommentAction from './components/SCCommentAction';
import SCShareAction from './components/SCShareAction';
import SCVoteAction from './components/SCVoteAction';
import SCCommentObjectReactions from './components/SCCommentObjectReactions';
import SCCommentObjectVotes from './components/SCCommentObjectVotes';
import SCActivitiesMenu from './components/SCActivitiesMenu';
import MuiTooltip from './components/MuiTooltip';
import SCCommentNotification from './components/SCCommentNotification';
import MuiPopover from './components/MuiPopover';
import SCUserActionIconButton from './components/SCUserActionIconButton';
import SCNavigationSettingsIconButton from './components/SCNavigationSettingsIconButton';
import SCUserInfoDialog from './components/SCUserInfoDialog';
import SCUserInfo from './components/SCUserInfo';
import SCUserCounters from './components/SCUserCounters';
import SCUserProfileEdit from './components/SCUserProfileEdit';
import SCVoteButton from './components/SCVoteButton';
import SCVoteAudienceButton from './components/SCVoteAudienceButton';
import SCEditorToolbarPlugin from './components/SCEditorToolbarPlugin';
import SCEditorFloatingLinkPlugin from './components/SCEditorFloatingLinkPlugin';

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
      minHeight: 40,
      '@media (min-width:0px)': {
        minHeight: 40
      },
      '@media (min-width:600px)': {
        minHeight: 40
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
    MuiIcon,
    MuiIconButton,
    MuiOutlinedInput,
    MuiPopover,
    MuiSelect,
    MuiTooltip,
    SCActivitiesMenu,
    SCBaseDialog,
    SCBaseItem,
    SCBaseItemButton,
    SCBottomNavigation,
    SCBroadcastMessages,
    SCCategories,
    SCCategoriesSkeleton,
    SCCategory,
    SCCategoryFeedTemplate,
    SCCategoryHeader,
    SCCategoryTemplate,
    SCCategoryTemplateSkeleton,
    SCChoices,
    SCCommentAction,
    SCCommentNotification,
    SCCommentObject,
    SCCommentObjectReactions,
    SCCommentObjectSkeleton,
    SCCommentObjectVotes,
    SCCommentsFeedObject,
    SCCommentsObject,
    SCComposer,
    SCCategoryAutocomplete,
    SCComposerPoll,
    SCContributionNotification,
    SCContributorsFeedObject,
    SCCustomSnackMessage,
    SCDateTimeAgo,
    SCEditor,
    SCEditorFloatingLinkPlugin,
    SCEditorToolbarPlugin,
    SCFeed,
    SCFeedObject,
    SCFeedObjectDetailTemplate,
    SCFeedObjectDetailTemplateSkeleton,
    SCFeedObjectSkeleton,
    SCFeedRelevantActivities,
    SCFeedSkeleton,
    SCFollowAction,
    SCInlineComposerWidget,
    SCLightbox,
    SCLoyaltyProgramWidget,
    SCLoyaltyProgramDetail,
    SCLoyaltyProgramWidgetSkeleton,
    SCLoyaltyProgramDetailSkeleton,
    SCNavigationSettingsIconButton,
    SCNavigationToolbar,
    SCNavigationToolbarMobile,
    SCNotification,
    SCNotificationItem,
    SCNotificationsMenu,
    SCPollObject,
    SCPreviewMediaDocument,
    SCPrivateMessageComponent,
    SCReactionAction,
    SCScrollContainer,
    SCSearchAutocomplete,
    SCShareAction,
    SCSnippetNotifications,
    SCSnippetNotificationsSkeleton,
    SCUser,
    SCUserActionIconButton,
    SCUserCounters,
    SCUserInfo,
    SCUserInfoDialog,
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
    SCPrivateMessageComponentSkeleton,
    SCPrivateMessageThreadSkeleton,
    SCPrivateMessageThreadItemDialog
  },
  selfcommunity: {
    user: {
      avatar: {
        sizeSmall: 24,
        sizeMedium: 30,
        sizeLarge: 60,
        sizeXLarge: 140
      }
    },
    category: {
      icon: {
        sizeMedium: 40
      }
    }
  }
};
export default theme;
