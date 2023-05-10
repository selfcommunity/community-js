import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, Icon, Stack, Typography} from '@mui/material';
import {
  ConnectionUserButton,
  FeedObjectProps,
  FeedSidebarProps,
  SCFeedWidgetType,
  TagChip,
  UserActionIconButton,
  UserCounters,
  UserFollowedCategoriesWidget,
  UserFollowedUsersWidget,
  UserFollowersWidget,
  UserProfileHeader,
  UserProfileHeaderProps
} from '@selfcommunity/react-ui';
import UserFeed, {UserFeedProps} from '../UserFeed';
import {
  SCFeatures,
  SCPreferences,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  SCUserContextType,
  useSCFetchUser,
  useSCPreferences,
  useSCRouting,
  useSCUser
} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import UserProfileSkeleton from './Skeleton';
import classNames from 'classnames';
import {FormattedMessage, useIntl} from 'react-intl';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCUserProfileTemplate';

const classes = {
  root: `${PREFIX}-root`,
  counters: `${PREFIX}-counters`,
  tags: `${PREFIX}-tags`,
  info: `${PREFIX}-info`,
  feed: `${PREFIX}-feed`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
   * @default [UserFollowedCategoriesWidget, UserFollowedUsersWidget]
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
   * Props to spread to UserTagStack component
   * @default {}
   */
  UserProfileHeaderProps?: UserProfileHeaderProps;

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
}

const WIDGETS = [
  {
    type: 'widget',
    component: UserFollowedCategoriesWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UserFollowedUsersWidget,
    componentProps: {},
    column: 'right',
    position: 1
  }
];

const MY_PROFILE_WIDGETS = [
  {
    type: 'widget',
    component: UserFollowedCategoriesWidget,
    componentProps: {},
    column: 'right',
    position: 0
  },
  {
    type: 'widget',
    component: UserFollowedUsersWidget,
    componentProps: {},
    column: 'right',
    position: 1
  },
  {
    type: 'widget',
    component: UserFollowersWidget,
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
    onEditClick = null,
    UserFeedProps = {}
  } = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scPreferencesContext: SCPreferencesContextType = useSCPreferences();
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const {features}: SCPreferencesContextType = useSCPreferences();

  // Hooks
  const {scUser} = useSCFetchUser({id: userId, user});
  const intl = useIntl();

  // MEMO
  const taggingEnabled = useMemo(() => features.includes(SCFeatures.TAGGING), [features]);
  const isMe = useMemo(() => scUserContext.user && scUser?.id === scUserContext.user.id, [scUserContext.user, scUser]);
  const followEnabled = useMemo(
    () =>
      SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
      scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value,
    [scPreferencesContext.preferences]
  );
  const privateMessageEnabled = useMemo(() => features.includes(SCFeatures.PRIVATE_MESSAGES), [features]);
  const isConnection = useMemo(() => {
    if (isMe || !scUserContext.user || !user) {
      return false;
    }
    return followEnabled ? scUserContext.managers.followers.isFollower(user) : scUserContext.managers.connections.status(user) === 'connected';
  }, [followEnabled, isMe, user, scUserContext.user, scUserContext.managers]);
  const isStaff = useMemo(() => user && user.community_badge, [user]);

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
  if (!isMe) {
    UserFeedProps.FeedProps = {HeaderComponent: null, ...UserFeedProps.FeedProps};
  }

  let actionItems = [];
  if (privateMessageEnabled && (isConnection || (scUserContext.user && scUserContext.user.role !== null) || isStaff)) {
    actionItems = [
      {
        label: <FormattedMessage defaultMessage="templates.userProfile.send.pm" id="templates.userProfile.send.pm" />,
        to: scRoutingContext.url(SCRoutes.USER_PRIVATE_MESSAGES_ROUTE_NAME, scUser)
      }
    ];
  }

  return (
    <Root id={id} className={classNames(classes.root, className)}>
      <UserProfileHeader user={scUser} {...UserProfileHeaderProps} />
      <Stack key={`actions_${scUser.id}`} direction="row" spacing={2} className={classes.actions}>
        {isMe ? (
          <Button variant="contained" color="secondary" onClick={handleEdit}>
            <FormattedMessage defaultMessage="templates.userProfile.edit" id="templates.userProfile.edit" />
          </Button>
        ) : (
          <>
            <ConnectionUserButton user={scUser} />
            <UserActionIconButton user={scUser} items={actionItems} />
          </>
        )}
      </Stack>
      <UserCounters className={classes.counters} userId={userId as number} user={scUser} />
      {scUser.date_joined && (
        <Typography className={classes.info}>
          <FormattedMessage
            id="templates.userProfile.dateJoined"
            defaultMessage="templates.userProfile.dateJoined"
            values={{
              date: intl.formatDate(scUser.date_joined, {
                year: 'numeric',
                month: 'long'
              })
            }}
          />
        </Typography>
      )}
      {scUser.location && (
        <Typography className={classes.info}>
          <Icon>add_location_alt</Icon> {scUser.location}
        </Typography>
      )}
      {taggingEnabled && (
        <Stack key={`tags_${scUser.id}`} direction="row" spacing={2} className={classes.tags}>
          {scUser.tags
            .filter((t) => t.visible)
            .map((tag) => (
              <TagChip key={tag.id} tag={tag} clickable={false} disposable={false} />
            ))}
        </Stack>
      )}
      <UserFeed
        key={`feed_${scUser.id}`}
        className={classes.feed}
        user={scUser}
        widgets={_widgets}
        FeedObjectProps={FeedObjectProps}
        FeedSidebarProps={FeedSidebarProps}
        {...UserFeedProps}
      />
    </Root>
  );
}
