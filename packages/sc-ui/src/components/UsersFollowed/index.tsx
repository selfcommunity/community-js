import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCUserContext, SCUserContextType, SCUserType} from '@selfcommunity/core';
import PeopleSuggestionSkeleton from '../Skeleton/PeopleSuggestionSkeleton';
import User, {UserProps} from '../User';
import {AxiosResponse} from 'axios';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

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

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface UsersFollowed {
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

export default function UsersFollowed(props: UsersFollowed): JSX.Element {
  // CONST
  const limit = 3;
  const intl = useIntl();

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // PROPS
  const {autoHide, className, UserProps = {}} = props;

  // STATE
  const [followed, setFollowed] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  /**
   * Handles list change on user follow
   */
  function handleClick(clickedId) {
    setFollowed(followed.filter((u) => u.id !== clickedId));
    setTotal((prev) => prev - 1);
    if (visibleUsers < limit && total > 1) {
      loadUsers(1);
    }
  }

  /**
   * Fetches the list of users followed
   */
  function fetchFollowed() {
    http
      .request({
        url: Endpoints.UsersFollowed.url({id: scUserContext.user['id']}),
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
        console.log(error);
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
    fetchFollowed();
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
          <Typography variant="body1">{`${intl.formatMessage(messages.usersFollowed, {total: total})}`}</Typography>
          {!total ? (
            <Typography variant="body2">{`${intl.formatMessage(messages.noUsers)}`}</Typography>
          ) : (
            <React.Fragment>
              <List>
                {followed.slice(0, visibleUsers).map((user: SCUserType, index) => (
                  <div key={index}>
                    <User elevation={0} user={user} key={user.id} onFollowProps={() => handleClick(user.id)} {...UserProps} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" sx={{color: ' black'}} onClick={() => loadUsers(limit)}>
                  <FormattedMessage id="ui.button.showMore" defaultMessage="ui.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return <Root className={className}>{u}</Root>;
  }
  return null;
}
