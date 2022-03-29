import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, Typography} from '@mui/material';
import Widget from '../Widget';
import {
  Endpoints,
  http,
  Logger,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  SCUserType
} from '@selfcommunity/core';
import Skeleton from './Skeleton';
import User, {UserProps} from '../User';
import {AxiosResponse} from 'axios';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import useThemeProps from '@mui/material/styles/useThemeProps';

const messages = defineMessages({
  title: {
    id: 'ui.usersFollowed.title',
    defaultMessage: 'ui.usersFollowed.title'
  },
  noUsers: {
    id: 'ui.usersFollowed.subtitle.noResults',
    defaultMessage: 'ui.usersFollowed.subtitle.noResults'
  }
});

const PREFIX = 'SCUsersFollowed';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  followedItem: `${PREFIX}-followed-item`,
  noResults: `${PREFIX}-noResults`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2),
  [`& .${classes.followedItem}`]: {
    marginBottom: theme.spacing()
  }
}));

export interface UsersFollowedProps {
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
 * > API documentation for the Community-UI Users Followed component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UsersFollowed} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCUsersFollowed` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUsersFollowed-root|Styles applied to the root element.|
 |title|.SCUsersFollowed-title|Styles applied to the title element.|
 |noResults|.SCUsersFollowed-noResults|Styles applied to noResults section.|
 |followedItem|.SCUsersFollowed-followed-item|Styles applied to the followed item element.|
 * @param inProps
 */
export default function UsersFollowed(inProps: UsersFollowedProps): JSX.Element {
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

  // PROPS
  const props: UsersFollowedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {userId, autoHide, className, UserProps = {}} = props;

  // STATE
  const [followed, setFollowed] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openUsersFollowedDialog, setOpenUsersFollowedDialog] = useState<boolean>(false);
  const [next, setNext] = useState<string>(`${Endpoints.UsersFollowed.url({id: userId ?? scUserContext.user['id']})}?limit=10`);

  /**
   * Handles list change on user follow
   */
  function handleOnFollowUser(user, follow) {
    if (scUserContext.user['id'] === userId) {
      setFollowed(followed.filter((u) => u.id !== user.id));
      setTotal((prev) => prev - 1);
      if (visibleUsers < limit && total > 1) {
        loadUsers(1);
      }
    }
  }

  /**
   * Fetches the list of users followed
   */
  function fetchFollowed() {
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.UsersFollowed.method
        })
        .then((res: AxiosResponse<any>) => {
          const data = res.data;
          setFollowed([...followed, ...data.results]);
          setHasMore(data.count > visibleUsers);
          setNext(data['next']);
          setLoading(false);
          setTotal(data.count);
        })
        .catch((error) => {
          setLoading(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }

  /**
   * Loads more users when followed list changes
   */
  function loadUsers(n) {
    const newIndex = visibleUsers + n;
    const newHasMore = newIndex < followed.length - 1;
    setVisibleUsers(newIndex);
    setHasMore(newHasMore);
  }

  /**
   * On mount, fetches the list of users followed
   */
  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    }
    fetchFollowed();
  }, [scUserContext.user]);

  /**
   * Renders the list of users followed
   */
  const u = (
    <React.Fragment>
      {loading ? (
        <Skeleton elevation={0} />
      ) : (
        <CardContent>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noUsers)}`}</Typography>
          ) : (
            <React.Fragment>
              <Typography className={classes.title} variant="body1">{`${intl.formatMessage(messages.title, {total: total})}`}</Typography>
              <List>
                {followed.slice(0, visibleUsers).map((user: SCUserType, index) => (
                  <div key={index}>
                    <User
                      elevation={0}
                      user={user}
                      key={user.id}
                      followConnectUserButtonProps={{onFollow: handleOnFollowUser}}
                      className={classes.followedItem}
                      {...UserProps}
                    />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => setOpenUsersFollowedDialog(true)}>
                  <FormattedMessage id="ui.usersFollowed.button.showAll" defaultMessage="ui.usersFollowed.button.showAll" />
                </Button>
              )}
              {openUsersFollowedDialog && (
                <BaseDialog
                  title={`${intl.formatMessage(messages.title, {total: total})}`}
                  onClose={() => setOpenUsersFollowedDialog(false)}
                  open={openUsersFollowedDialog}>
                  {loading ? (
                    <CentralProgress size={50} />
                  ) : (
                    <InfiniteScroll
                      dataLength={followed.length}
                      next={fetchFollowed}
                      hasMore={Boolean(next)}
                      loader={<CentralProgress size={30} />}
                      height={400}
                      endMessage={
                        <p style={{textAlign: 'center'}}>
                          <b>
                            <FormattedMessage id="ui.usersFollowed.noMoreResults" defaultMessage="ui.usersFollowed.noMoreResults" />
                          </b>
                        </p>
                      }>
                      <List>
                        {followed.map((f, index) => (
                          <User elevation={0} user={f} key={f.id} {...UserProps} className={classes.followedItem} />
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
    return null;
  }
  /**
   * If content availability community option is false and user is anonymous , component is hidden.
   */
  if (!contentAvailability && !scUserContext.user) {
    return null;
  }
  /**
   * Renders root object
   */
  return <Root className={classNames(classes.root, className)}>{u}</Root>;
}
