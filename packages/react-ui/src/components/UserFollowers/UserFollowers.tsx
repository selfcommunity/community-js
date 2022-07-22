import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography} from '@mui/material';
import Widget from '../Widget';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import Skeleton from './Skeleton';
import User, {UserProps} from '../User';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';

const messages = defineMessages({
  title: {
    id: 'ui.userFollowers.title',
    defaultMessage: 'ui.userFollowers.title'
  },
  noFollowers: {
    id: 'ui.userFollowers.subtitle.noResults',
    defaultMessage: 'ui.userFollowers.subtitle.noResults'
  }
});

const PREFIX = 'SCUsersFollowed';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  followersItem: `${PREFIX}-followers-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.followersItem}`]: {
    marginBottom: theme.spacing()
  }
}));

export interface UserFollowersProps {
  /**
   * The user id
   * @default null
   */
  userId?: number;
  /**
   * Hides this component
   * @default false
   */
  autoHide?: boolean;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Props to spread to single user object
   * @default empty object
   */
  UserProps?: UserProps;
}

/**
 * > API documentation for the Community-JS User Followers component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFollowers} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserFollowers` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowers-root|Styles applied to the root element.|
 |title|.SCUserFollowers-title|Styles applied to the title element.|
 |noResults|.SCUserFollowers-no-results|Styles applied to no results section.|
 |followersItem|.SCUserFollowers-followers-item|Styles applied to follower item element.|
 |showMore|.SCUserFollowers-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function UserFollowers(inProps: UserFollowersProps): JSX.Element {
  // CONST
  const limit = 3;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const contentAvailability =
    SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_CONTENT_AVAILABILITY].value;
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  // PROPS
  const props: UserFollowersProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {userId, autoHide, className, UserProps = {}} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const [followers, setFollowers] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openUserFollowersDialog, setOpenUserFollowersDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.UserFollowers.url({id: userId ?? scUserContext.user['id']})}?limit=10`);

  /**
   * Fetches the list of users followers
   */
  function fetchFollowers() {
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.UserFollowers.method
        })
        .then((res: HttpResponse<any>) => {
          if (isMountedRef.current) {
            const data = res.data;
            setFollowers([...followers, ...data.results]);
            setHasMore(data.count > visibleUsers);
            setNext(data['next']);
            setLoading(false);
            setTotal(data.count);
          }
        })
        .catch((error) => {
          setLoading(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * On mount, fetches the list of users followers
   */
  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    }
    fetchFollowers();
  }, [scUserContext.user]);

  /**
   * Handles followers counter update on follow/unfollow action.
   * @param user
   */
  function handleFollowersUpdate(user) {
    const newUsers = [...followers];
    const index = newUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      if (user.connection_status === 'followed') {
        newUsers[index].followers_counter = user.followers_counter - 1;
        newUsers[index].connection_status = null;
      } else {
        newUsers[index].followers_counter = user.followers_counter + 1;
        newUsers[index].connection_status = 'followed';
      }
      setFollowers(newUsers);
    }
  }

  /**
   * Renders the list of users followers
   */
  const u = (
    <React.Fragment>
      {loading ? (
        <Skeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography className={classes.title} variant="h5">{`${intl.formatMessage(messages.title, {total: total})}`}</Typography>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noFollowers)}`}</Typography>
          ) : (
            <React.Fragment>
              <List>
                {followers.slice(0, visibleUsers).map((user: SCUserType) => (
                  <ListItem key={user.id}>
                    <User
                      elevation={0}
                      user={user}
                      className={classes.followersItem}
                      {...(followEnabled
                        ? {followConnectUserButtonProps: {onFollow: handleFollowersUpdate}}
                        : {followConnectUserButtonProps: {onChangeConnectionStatus: handleFollowersUpdate}})}
                      {...UserProps}
                    />
                  </ListItem>
                ))}
              </List>
              {hasMore && (
                <Button size="small" className={classes.showMore} onClick={() => setOpenUserFollowersDialog(true)}>
                  <FormattedMessage id="ui.userFollowers.button.showAll" defaultMessage="ui.userFollowers.button.showAll" />
                </Button>
              )}
              {openUserFollowersDialog && (
                <BaseDialog
                  title={`${intl.formatMessage(messages.title, {total: total})}`}
                  onClose={() => setOpenUserFollowersDialog(false)}
                  open={openUserFollowersDialog}>
                  {loading ? (
                    <CentralProgress size={50} />
                  ) : (
                    <InfiniteScroll
                      dataLength={followers.length}
                      next={fetchFollowers}
                      hasMoreNext={Boolean(next)}
                      loaderNext={<CentralProgress size={30} />}
                      height={400}
                      endMessage={
                        <p style={{textAlign: 'center'}}>
                          <b>
                            <FormattedMessage id="ui.userFollowers.noMoreResults" defaultMessage="ui.userFollowers.noMoreResults" />
                          </b>
                        </p>
                      }>
                      <List>
                        {followers.map((f) => (
                          <ListItem key={f.id}>
                            <User
                              elevation={0}
                              user={f}
                              className={classes.followersItem}
                              {...(followEnabled
                                ? {followConnectUserButtonProps: {onFollow: handleFollowersUpdate}}
                                : {followConnectUserButtonProps: {onChangeConnectionStatus: handleFollowersUpdate}})}
                              {...UserProps}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </InfiniteScroll>
                  )}
                </BaseDialog>
              )}
            </React.Fragment>
          )}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * if there are no results and autoHide prop is set to true ,component is hidden
   */
  if (autoHide && !total) {
    return <HiddenPlaceholder />;
  }
  /**
   * If content availability community option is false and user is anonymous , component is hidden.
   */
  if (!contentAvailability && !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  /**
   * Renders root object
   */
  return <Root className={classNames(classes.root, className)}>{u}</Root>;
}
