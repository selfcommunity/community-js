import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardContent, List, ListItem, Typography} from '@mui/material';
import {SCUserType} from '@selfcommunity/types';
import {http, Endpoints} from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import PeopleSuggestionSkeleton from './Skeleton';
import User, {UserProps} from '../User';
import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import Widget from '../Widget';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';

const PREFIX = 'SCPeopleSuggestion';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  suggestedUserItem: `${PREFIX}-suggested-user-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.suggestedUserItem}`]: {
    marginBottom: theme.spacing()
  }
}));

export interface PeopleSuggestionProps extends VirtualScrollerItemProps {
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

/**
 *
 > API documentation for the Community-JS People Suggestion component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PeopleSuggestion} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPeopleSuggestion` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPeopleSuggestion-root|Styles applied to the root element.|
 |title|.SCPeopleSuggestion-title|Styles applied to the title element.|
 |suggestedUserItem|.SCPeopleSuggestion-suggested-user-item|Styles applied to the suggested user element.|
 |noResults|.SCPeopleSuggestion-no-results|Styles applied to the no results section.|
 |showMore|.SCPeopleSuggestion-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function PeopleSuggestion(inProps: PeopleSuggestionProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: PeopleSuggestionProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {autoHide, className, UserProps = {}, onHeightChange, ...rest} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

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

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  /**
   * Handles list change on user follow
   */
  function handleOnFollowUser(user, follow) {
    setUsers(users.filter((u) => u.id !== user.id));
    setTotal((prev) => prev - 1);
    setHasMore(total - 1 > limit);
  }

  /**
   * Handles list change on user connection
   */
  function handleOnConnectUser(user, status) {
    setUsers(users.filter((u) => u.id !== user.id));
    setTotal((prev) => prev - 1);
    setHasMore(total - 1 > limit);
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
        if (isMountedRef.current) {
          const data = res.data;
          setUsers(data['results']);
          setHasMore(data['count'] > visiblePeople);
          setLoading(false);
          setTotal(data.count);
        }
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
    } else {
      setLoading(false);
    }
  }, [authUserId]);

  /**
   * Virtual feed update
   */
  useEffect(() => {
    onHeightChange && onHeightChange();
  }, [users.length, loading]);

  /**
   * Renders people suggestion list
   */
  if (loading) {
    return <PeopleSuggestionSkeleton />;
  }
  /**
   * Renders root object (if results and if user is logged, otherwise component is hidden)
   */
  if ((autoHide && !total) || !scUserContext.user) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <CardContent>
        <Typography className={classes.title} variant="h5">
          <FormattedMessage id="ui.peopleSuggestion.title" defaultMessage="ui.peopleSuggestion.title" />
        </Typography>
        {!total ? (
          <Typography className={classes.noResults} variant="body2">
            <FormattedMessage id="ui.peopleSuggestion.subtitle.noResults" defaultMessage="ui.peopleSuggestion.subtitle.noResults" />
          </Typography>
        ) : (
          <React.Fragment>
            <List>
              {users.slice(0, visiblePeople).map((user: SCUserType, index) => (
                <ListItem key={user.id}>
                  <User
                    elevation={0}
                    user={user}
                    {...(followEnabled
                      ? {followConnectUserButtonProps: {onFollow: handleOnFollowUser}}
                      : {followConnectUserButtonProps: {onChangeConnectionStatus: handleOnConnectUser}})}
                    className={classes.suggestedUserItem}
                    {...UserProps}
                  />
                </ListItem>
              ))}
            </List>
            {hasMore && (
              <Button className={classes.showMore} size="small" onClick={() => loadPeople(limit)}>
                <FormattedMessage id="ui.peopleSuggestion.button.showMore" defaultMessage="ui.peopleSuggestion.button.showMore" />
              </Button>
            )}
          </React.Fragment>
        )}
        {openPeopleSuggestionDialog && <></>}
      </CardContent>
    </Root>
  );
}
