import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, Logger, SCUserContext, SCUserContextType, SCUserType} from '@selfcommunity/core';
import PeopleSuggestionSkeleton from '../PeopleSuggestion/Skeleton';
import User, {UserProps} from '../User';
import {AxiosResponse} from 'axios';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';

const messages = defineMessages({
  usersFollowed: {
    id: 'ui.usersFollowed.usersFollowed',
    defaultMessage: 'ui.usersFollowed.usersFollowed'
  },
  noUsers: {
    id: 'ui.usersFollowed.subtitle.noResults',
    defaultMessage: 'ui.usersFollowed.subtitle.noResults'
  }
});

const PREFIX = 'SCUsersFollowed';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
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

export default function UsersFollowed(props: UsersFollowedProps): JSX.Element {
  // CONST
  const limit = 3;

  // INTL
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PROPS
  const {userId, autoHide, className, UserProps = {}} = props;

  // STATE
  const [followed, setFollowed] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

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
    http
      .request({
        url: Endpoints.UsersFollowed.url({id: userId ?? scUserContext.user['id']}),
        method: Endpoints.UsersFollowed.method
      })
      .then((res: AxiosResponse<any>) => {
        const data = res.data;
        setFollowed(data.results);
        setHasMore(data.count > visibleUsers);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        setLoading(false);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Loads more users on "see more" button click
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
    if (scUserContext.user) {
      fetchFollowed();
    }
  }, []);

  /**
   * Renders the list of users followed
   */
  const u = (
    <React.Fragment>
      {loading ? (
        <PeopleSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          {!total ? (
            <Typography variant="body2">{`${intl.formatMessage(messages.noUsers)}`}</Typography>
          ) : (
            <React.Fragment>
              <Typography variant="body1">{`${intl.formatMessage(messages.usersFollowed, {total: total})}`}</Typography>
              <List>
                {followed.slice(0, visibleUsers).map((user: SCUserType, index) => (
                  <div key={index}>
                    <User elevation={0} user={user} key={user.id} followConnectUserButtonProps={{onFollow: handleOnFollowUser}} {...UserProps} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => loadUsers(limit)}>
                  <FormattedMessage id="ui.usersFollowed.button.showMore" defaultMessage="ui.usersFollowed.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return null;
  }
  if (scUserContext.user) {
    return <Root className={classNames(classes.root, className)}>{u}</Root>;
  }
  return null;
}
