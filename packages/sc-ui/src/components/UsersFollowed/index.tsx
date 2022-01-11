import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Divider, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCFollowedManagerType, SCUserContext, SCUserContextType, SCUserType, useSCUser} from '@selfcommunity/core';
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
   * Override or extend the styles applied to the component.
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
  const {autoHide, className, UserProps = {}} = props;
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const [followed, setFollowed] = useState<any[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const intl = useIntl();

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

  function loadUsers() {
    const newIndex = visibleUsers + 3;
    const newHasMore = newIndex < followed.length - 1;
    setVisibleUsers(newIndex);
    setHasMore(newHasMore);
  }

  useEffect(() => {
    fetchFollowed();
  }, []);

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
                {followed.slice(0, visibleUsers).map((follower: SCUserType, index) => (
                  <User elevation={0} user={follower} key={index} id={follower.id} {...UserProps} />
                ))}
              </List>
              {hasMore && (
                <Button size="small" sx={{color: ' black'}} onClick={() => loadUsers()}>
                  <FormattedMessage id="ui.button.showMore" defaultMessage="ui.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
        </CardContent>
      )}
    </React.Fragment>
  );

  if (!autoHide) {
    return <Root className={className}>{u}</Root>;
  }
  return null;
}
