import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, CardHeader, Typography} from '@mui/material';
import {Feed, User, UserSkeleton, Widget} from '@selfcommunity/react-ui';
import {
  Link,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCRoutes,
  SCRoutingContextType,
  useSCFetchUser,
  useSCRouting
} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import UsersListSkeleton from './Skeleton';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {Endpoints, EndpointType} from '@selfcommunity/api-services';

const PREFIX = 'SCUsersListTemplate';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Feed, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(2),
  //marginLeft: theme.spacing(-4),
  '& .SCFeed-left .SCUser-root': {
    marginBottom: theme.spacing(2)
  }
}));

const messages = defineMessages({
  usersNumber: {
    id: 'templates.usersList.card.secondary',
    defaultMessage: 'templates.usersList.card.secondary'
  }
});

export interface UsersListProps {
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
   * The endpoint to fetch for data
   */
  endpoint: EndpointType;
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
   * Props to show followers
   * @default false
   */
  showFollowers?: boolean;
  /**
   * Props to show component header
   * @default false
   */
  showHeader?: boolean;
}

/**
 * > API documentation for the Community-JS Users List Template. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UsersList} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCUsersListTemplate` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUsersListTemplate-root|Styles applied to the root element.|
 |actions|.SCUsersListTemplate-actions|Styles applied to the actions section.|
 *
 * @param inProps
 */
export default function UsersList(inProps: UsersListProps): JSX.Element {
  // PROPS
  const props: UsersListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'users_list', className, user, userId, showFollowers, showHeader = true, endpoint} = props;

  // CONTEXT
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();
  // Hooks
  const {scUser} = useSCFetchUser({id: userId, user});

  function renderHeader() {
    if (followEnabled) {
      return (
        <CardHeader
          avatar={
            <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, scUser)}>
              <Avatar alt={scUser.username} src={scUser.avatar} sx={{width: '80px', height: '80px'}} />
            </Link>
          }
          title={
            showFollowers ? (
              <Typography variant="h6">
                <FormattedMessage defaultMessage="templates.usersList.followers" id="templates.usersList.followers" />
              </Typography>
            ) : (
              <Typography variant="h6">
                <FormattedMessage defaultMessage="templates.usersList.followings" id="templates.usersList.followings" />
              </Typography>
            )
          }
          subheader={
            <Typography variant="subtitle1">
              {`${intl.formatMessage(messages.usersNumber, showFollowers ? {total: scUser.followers_counter} : {total: scUser.followings_counter})}`}
            </Typography>
          }
        />
      );
    }
  }

  if (scUser === null || !endpoint) {
    return <UsersListSkeleton />;
  }

  return (
    <Root
      id={id}
      className={classNames(classes.root, className)}
      endpoint={endpoint}
      ItemComponent={User}
      itemPropsGenerator={(scUser, item) => ({user: item})}
      itemIdGenerator={(item: any) => item.id}
      ItemProps={{showFollowers: followEnabled}}
      ItemSkeleton={UserSkeleton}
      ItemSkeletonProps={{sx: {marginBottom: 2}}}
      HeaderComponent={showHeader && followEnabled ? renderHeader() : null}
      FooterComponent={null}
      hideAdvs={true}
      endMessage={<FormattedMessage id="templates.usersList.noMoreResults" defaultMessage="templates.usersList.noMoreResults" />}
    />
  );
}
