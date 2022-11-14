import React, {useContext} from 'react';
import {styled} from '@mui/material/styles';
import {Feed, User, UserSkeleton} from '@selfcommunity/react-ui';
import {SCPreferences, SCPreferencesContext, SCPreferencesContextType, useSCFetchUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import UsersListSkeleton from './Skeleton';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {EndpointType} from '@selfcommunity/api-services';

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
  '& .SCFeed-left .SCUser-root': {
    marginBottom: theme.spacing(2)
  }
}));

export interface UsersListProps {
  /**
   * Id of the component
   * @default 'users_list'
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
   * Props to show component header
   * @default null
   */
  header?: JSX.Element;
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
 *
 * @param inProps
 */
export default function UsersList(inProps: UsersListProps): JSX.Element {
  // PROPS
  const props: UsersListProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {id = 'users_list', className, user, userId, header = null, endpoint} = props;
  // HOOKS
  const {scUser} = useSCFetchUser({id: userId, user});
  // CONTEXT
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

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
      HeaderComponent={header}
      FooterComponent={null}
      hideAdvs={true}
      endMessage={<FormattedMessage id="templates.usersList.noMoreResults" defaultMessage="templates.usersList.noMoreResults" />}
    />
  );
}
