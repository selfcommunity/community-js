import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Endpoints, http, SCUserType} from '@selfcommunity/core';
import {PeopleSuggestionSkeleton} from '../Skeleton';
import User, {UserProps} from '../User';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCPeopleSuggestion';

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
}));

export interface PeopleSuggestion {
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

export default function PeopleSuggestion(props: PeopleSuggestion): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {autoHide, className, UserProps = {}} = props;

  // STATE
  const [users, setUsers] = useState<SCUserType[]>([]);
  const [visiblePeople, setVisiblePeople] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openPeopleSuggestionDialog, setOpenPeopleSuggestionDialog] = useState<boolean>(false);

  /**
   * Handles list change on user follow
   */
  function handleClick(clickedId) {
    setUsers(users.filter((u) => u.id !== clickedId));
    if (visiblePeople < limit && total > 1) {
      loadPeople(1);
    }
  }

  /**
   * Fetches user suggestion list
   */
  function fetchUserSuggestion() {
    http
      .request({
        url: Endpoints.UserSuggestion.url(),
        method: Endpoints.UserSuggestion.method
      })
      .then((res: any) => {
        const data = res.data;
        setUsers(data['results']);
        setHasMore(data['count'] > visiblePeople);
        setLoading(false);
        setTotal(data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Loads more people on "see more" button click
   */
  function loadPeople(n) {
    const newIndex = visiblePeople + n;
    const newHasMore = newIndex < users.length - 1;
    setVisiblePeople(newIndex);
    setHasMore(newHasMore);
  }

  /**
   * On mount, fetches people suggestion list
   */
  useEffect(() => {
    fetchUserSuggestion();
  }, []);

  /**
   * Renders people suggestion list
   */
  const p = (
    <React.Fragment>
      {loading ? (
        <PeopleSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          <Typography variant="body1">
            <FormattedMessage id="ui.peopleSuggestion.title" defaultMessage="ui.peopleSuggestion.title" />
          </Typography>
          {!total ? (
            <Typography variant="body2">
              <FormattedMessage id="ui.peopleSuggestion.subtitle.noResults" defaultMessage="ui.peopleSuggestion.subtitle.noResults" />
            </Typography>
          ) : (
            <React.Fragment>
              <List>
                {users.slice(0, visiblePeople).map((user: SCUserType, index) => (
                  <div key={index}>
                    <User elevation={0} user={user} key={user.id} onFollowProps={() => handleClick(user.id)} {...UserProps} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button color="secondary" size="small" onClick={() => loadPeople(limit)}>
                  <FormattedMessage id="ui.button.showMore" defaultMessage="ui.button.showMore" />
                </Button>
              )}
            </React.Fragment>
          )}
          {openPeopleSuggestionDialog && <></>}
        </CardContent>
      )}
    </React.Fragment>
  );

  /**
   * Renders root object (if not hidden by autoHide prop)
   */
  if (!autoHide) {
    return <Root className={className}>{p}</Root>;
  }
  return null;
}
