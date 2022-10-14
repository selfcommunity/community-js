import React from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Stack} from '@mui/material';
import {
  CategoriesFollowed,
  ConnectionUserButton,
  FeedObjectProps,
  FeedSidebarProps,
  SCFeedWidgetType,
  UserFollowers,
  UserProfileHeader,
  UserProfileHeaderProps,
  UserProfileInfo,
  UserProfileInfoProps,
  UsersFollowed
} from '@selfcommunity/react-ui';
import UserFeed, {UserFeedProps} from '../UserFeed';
import {
  Link,
  SCContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCContext,
  useSCFetchUser,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import UserProfileSkeleton from './Skeleton';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCUserProfileTemplate';

const classes = {
  root: `${PREFIX}-root`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  [`& .${classes.actions}`]: {
    margin: theme.spacing(2),
    justifyContent: 'space-around'
  }
}));

export interface UserProfileProps {
  /**
   * Id of the user profile
   * @default 'user'
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * User Object
   * @default null
   */
  user?: SCUserType;

  /**
   * Id of the user for filter the feed
   * @default null
   */
  userId?: number | string;

  /**
   * Widgets to be rendered into the feed
   * @default [CategoriesFollowed, UserFollowed]
   */
  widgets?: SCFeedWidgetType[] | null;

  /**
   * Props to spread to single feed object
   * @default empty object
   */
  FeedObjectProps?: FeedObjectProps;

  /**
   * Props to spread to single feed object
   * @default {top: 0, bottomBoundary: `#${id}`}
   */
  FeedSidebarProps?: FeedSidebarProps;

  /**
   * Props to spread to UserProfileHeader component
   * @default {}
   */
  UserProfileHeaderProps?: UserProfileHeaderProps;

  /**
   * Props to spread to UserProfileInfo component
   * @default {}
   */
  UserProfileInfoProps?: UserProfileInfoProps;

  /**
   * Click handler for edit button
   * @default null
   */
  onEditClick?: (user: SCUserType) => void;

  /**
   * Props to spread to feed component
   * @default {}
   */
  UserFeedProps?: UserFeedProps;
  /**
   * Props to show send pm
   * @default false
   */
  showSendPmButton?: boolean;
}

const WIDGETS = [
  {
    type: 'widget',
    component: CategoriesFollowed,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UsersFollowed,
    componentProps: {},
    column: 'right',
    position: 1
  }
];

const MY_PROFILE_WIDGETS = [
  {
    type: 'widget',
    component: CategoriesFollowed,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UsersFollowed,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: UserFollowers,
    componentProps: {},
    column: 'right',
    position: 2
  }
];

/**
 * > API documentation for the Community-JS User Profile Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserProfile} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUserProfileTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserProfileTemplate-root|Styles applied to the root element.|
 |actions|.SCUserProfileTemplate-actions|Styles applied to the actions section.|
 *
 * @param inProps
 */
export default function UserProfile(inProps: UserProfileProps): JSX.Element {
  // PROPS
  const props: UserProfileProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    id = 'user_profile',
    className,
    user,
    userId,
    widgets = null,
    FeedObjectProps,
    FeedSidebarProps,
    UserProfileHeaderProps = {},
    UserProfileInfoProps = {},
    onEditClick = null,
    UserFeedProps = {},
    showSendPmButton
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // Hooks
  const {scUser} = useSCFetchUser({id: userId, user});

  if (scUser === null) {
    return <UserProfileSkeleton />;
  }

  // Utils
  const getWidgets = () => {
    let _widgets = [];
    if (scUserContext.user === null) {
      _widgets = [];
    } else if (scUserContext.user.id === scUser.id) {
      _widgets = [...MY_PROFILE_WIDGETS];
    } else {
      _widgets = [...WIDGETS];
    }
    return _widgets.map((w) => ({...w, componentProps: {...w.componentProps, userId: scUser.id}}));
  };

  // Choose widgets based on user session
  let _widgets = widgets;
  if (_widgets === null) {
    _widgets = getWidgets();
  }

  // HANDLERS
  const handleEdit = () => {
    onEditClick && onEditClick(scUser);
  };

  // RENDER
  const isMe = scUserContext.user && scUser.id === scUserContext.user.id;
  const roles = scUserContext.user && scUserContext.user.role;
  const canModerate = roles && (roles.includes('admin') || roles.includes('moderator')) && !isMe;

  if (!isMe) {
    UserFeedProps.FeedProps = {HeaderComponent: null, ...UserFeedProps.FeedProps};
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <UserProfileHeader user={scUser} {...UserProfileHeaderProps} />
      <UserProfileInfo user={scUser} {...UserProfileInfoProps} />
      <Stack key={`actions_${scUser.id}`} direction="row" spacing={2} className={classes.actions}>
        {isMe ? (
          <Button variant="outlined" color="secondary" onClick={handleEdit}>
            <FormattedMessage defaultMessage="templates.userProfile.edit" id="templates.userProfile.edit" />
          </Button>
        ) : (
          <>
            <ConnectionUserButton user={scUser} />
            {showSendPmButton && (
              <Button color="secondary" component={Link} to={scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, scUser)}>
                <FormattedMessage defaultMessage="templates.userProfile.send.pm" id="templates.userProfile.send.pm" />
              </Button>
            )}
          </>
        )}
        {canModerate && (
          <Button
            variant="contained"
            color="secondary"
            component="a"
            href={`${scContext.settings.portal}/platform/access?next=/moderation/user/?username=${scUser.username}`}
            target="_blank">
            <FormattedMessage defaultMessage="templates.userProfile.moderate" id="templates.userProfile.moderate" />
          </Button>
        )}
      </Stack>
      <UserFeed
        key={`feed_${scUser.id}`}
        user={scUser}
        widgets={_widgets}
        FeedObjectProps={FeedObjectProps}
        FeedSidebarProps={FeedSidebarProps}
        {...UserFeedProps}
      />
    </Root>
  );
}
