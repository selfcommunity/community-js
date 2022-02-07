import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
  Endpoints,
  http,
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  SCUserType
} from '@selfcommunity/core';
import PeopleSuggestionSkeleton from './Skeleton';
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

export interface PeopleSuggestionProps {
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

  /**
   * Other props
   */
  [p: string]: any;
}

export default function PeopleSuggestion(props: PeopleSuggestionProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const {autoHide, className, UserProps = {}, ...rest} = props;

  // STATE
  const [users, setUsers] = useState<SCUserType[]>([]);
  const [visiblePeople, setVisiblePeople] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [openPeopleSuggestionDialog, setOpenPeopleSuggestionDialog] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  /**
   * Handles list change on user follow
   */
  function handleOnFollowUser(user, follow) {
    setUsers(users.filter((u) => u.id !== user.id));
    if (visiblePeople < limit && total > 1) {
      loadPeople(1);
    }
  }

  /**
   * Handles list change on user connection
   */
  function handleOnConnectUser(user, status) {
    setUsers(users.filter((u) => u.id !== user.id));
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
    if (scUserContext.user) {
      fetchUserSuggestion();
    }
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
                    <User
                      elevation={0}
                      user={user}
                      key={user.id}
                      {...(followEnabled
                        ? {followUserButtonProps: {onFollow: handleOnFollowUser}}
                        : {connectUserButtonProps: {onChangeConnectionStatus: handleOnConnectUser}})}
                      {...UserProps}
                    />
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
  if (!autoHide && scUserContext.user) {
    return (
      <Root className={className} {...rest}>
        {p}
      </Root>
    );
  }
  return null;
}
