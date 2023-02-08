import { createTheme } from '@mui/material/styles';

import './styles/reset.css';
import './fonts/community-icons.css';

/**
 * Style fragments - Imports - Start
 */
import SCWidget from './components/SCWidget';
import SCBaseDialog from './components/SCBaseDialog';
import SCInlineComposer from './components/SCInlineComposer';
import SCEditor from './components/SCEditor';
import SCCommentsObject from './components/SCCommentsObject';
import SCCommentsFeedObject from './components/SCCommentsFeedObject';
import SCComposer from './components/SCComposer';
import SCBroadcastMessages from './components/SCBroadcastMessages';
import SCUserNotification from './components/SCUserNotification';
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
import SCMobileHeader from './components/SCMobileHeader';
import SCPrivateMessagesTemplate from './components/SCPrivateMessagesTemplate';
import MuiDialog from './components/MuiDialog';
import SCCategories from './components/SCCategories';
import MuiIcon from './components/MuiIcon';
import SCCategory from './components/SCCategory';
import SCDateTimeAgo from './components/SCDateTimeAgo';
import SCFeedRelevantActivities from './components/SCFeedRelevantActivities';
import MuiIconButton from './components/MuiIconButton';
import SCUser from './components/SCUser';
import SCLoyaltyProgram from './components/SCLoyaltyProgram';
import MuiOutlinedInput from './components/MuiOutlinedInput';
import MuiSelect from './components/MuiSelect';
import SCComposerCategories from './components/SCComposerCategories';
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

/**
 * Style fragments - Imports - End
 */

const theme = createTheme({
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
    MuiSelect,
    SCNavigationToolbar,
    SCNavigationToolbarMobile,
    SCBottomNavigation,
    SCSearchAutocomplete,
    SCWidget,
    SCBaseDialog,
    SCBaseItem,
    SCBaseItemButton,
    SCCategory,
    SCCategoryTemplate,
    SCCategoriesSkeleton,
    SCCategoryTemplateSkeleton,
    SCCategoryFeedTemplate,
    SCCategoryHeader,
    SCContributorsFeedObject,
    SCDateTimeAgo,
    SCInlineComposer,
    SCLoyaltyProgram,
    SCLoyaltyProgramDetail,
    SCEditor,
    SCChoices,
    SCCommentsObject,
    SCCommentObject,
    SCCommentObjectSkeleton,
    SCCommentsFeedObject,
    SCComposer,
    SCComposerCategories,
    SCComposerPoll,
    SCBroadcastMessages,
    SCSnippetNotifications,
    SCCustomSnackMessage,
    SCScrollContainer,
    SCFeedObject,
    SCFeedObjectSkeleton,
    SCFeedObjectDetailTemplate,
    SCFeedObjectDetailTemplateSkeleton,
    SCFeedRelevantActivities,
    SCFeed,
    SCFeedSkeleton,
    SCPollObject,
    SCPreviewMediaDocument,
    SCUser,
    SCUserNotification,
    SCUserProfileTemplate,
    SCUserProfileHeader,
    SCMobileHeader,
    SCPrivateMessagesTemplate,
    SCCategories
  },
  selfcommunity: {
    user: {
      avatar: {
        sizeSmall: 24,
        sizeMedium: 30,
        sizeLarge: 140
      }
    },
    category: {
      icon: {
        sizeMedium: 40
      }
    }
  }
});

export default theme;
