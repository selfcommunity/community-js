import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, CardContent, ListItem, Typography, useMediaQuery, useTheme} from '@mui/material';
import Widget from '../Widget';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {
  SCPreferences,
  SCPreferencesContext,
  SCPreferencesContextType,
  SCUserContext,
  SCUserContextType,
  useIsComponentMountedRef
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import User, {UserProps} from '../User';
import classNames from 'classnames';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from '../../shared/InfiniteScroll';
import Skeleton from './Skeleton';
import {useThemeProps} from '@mui/system';
import HiddenPlaceholder from '../../shared/HiddenPlaceholder';
import {VirtualScrollerItemProps} from '../../types/virtualScroller';

const PREFIX = 'SCTrendingPeople';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  trendingUserItem: `${PREFIX}-trending-user-item`,
  noResults: `${PREFIX}-no-results`,
  showMore: `${PREFIX}-show-more`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginBottom: theme.spacing(2),
  [`& .${classes.trendingUserItem}`]: {
    marginBottom: theme.spacing()
  }
}));

export interface TrendingPeopleProps extends VirtualScrollerItemProps {
  /**
   * Category id
   * @default null
   */
  categoryId?: number;

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
 * > API documentation for the Community-JS Trending People component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {TrendingPeople} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCTrendingPeople` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCTrendingPeople-root|Styles applied to the root element.|
 |title|.SCTrendingPeople-title|Styles applied to the title element.|
 |noResults|.SCTrendingPeople-no-results|Styles applied to no results section.|
 |trendingUserItem|.SCTrendingPeople-trending-user-item|Styles applied to the trending user item element.|
 |showMore|.SCTrendingPeople-show-more|Styles applied to show more button element.|

 * @param inProps
 */
export default function TrendingPeople(inProps: TrendingPeopleProps): JSX.Element {
  // CONST
  const limit = 3;

  // PROPS
  const props: TrendingPeopleProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {categoryId, autoHide, className, UserProps = {}, ...rest} = props;

  // REFS
  const isMountedRef = useIsComponentMountedRef();

  // STATE
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [people, setPeople] = useState<any[]>([]);
  const [visiblePeople, setVisiblePeople] = useState<number>(limit);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [openTrendingPeopleDialog, setOpenTrendingPeopleDialog] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [next, setNext] = useState<string>(`${Endpoints.CategoryTrendingPeople.url({id: categoryId})}?limit=10`);

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const scPreferencesContext: SCPreferencesContextType = useContext(SCPreferencesContext);
  const followEnabled =
    SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED in scPreferencesContext.preferences &&
    scPreferencesContext.preferences[SCPreferences.CONFIGURATIONS_FOLLOW_ENABLED].value;

  /**
   * Fetches trending people list
   */
  function fetchTrendingPeople() {
    setLoading(true);
    if (next) {
      http
        .request({
          url: next,
          method: Endpoints.CategoryTrendingPeople.method
        })
        .then((res: HttpResponse<any>) => {
          if (isMountedRef.current) {
            const data = res.data;
            setPeople([...people, ...data.results]);
            setHasMore(data.count > visiblePeople);
            setNext(data['next']);
            setLoading(false);
            setTotal(data.count);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }

  /**
   * On mount, fetches trending people list
   */
  useEffect(() => {
    fetchTrendingPeople();
  }, []);

  /**
   * Handles followers counter update on follow/unfollow action.
   * @param user
   */
  function handleFollowersUpdate(user) {
    const newUsers = [...people];
    const index = newUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      if (user.connection_status === 'followed') {
        newUsers[index].followers_counter = user.followers_counter - 1;
        newUsers[index].connection_status = null;
      } else {
        newUsers[index].followers_counter = user.followers_counter + 1;
        newUsers[index].connection_status = 'followed';
      }
      setPeople(newUsers);
    }
  }

  /**
   * Renders trending people list
   */
  if (loading) {
    return <Skeleton />;
  }
  const p = (
    <CardContent>
      <Typography className={classes.title} variant="h5">
        <FormattedMessage id="ui.trendingPeople.title" defaultMessage="ui.trendingPeople.title" />
      </Typography>
      {!total ? (
        <Typography className={classes.noResults} variant="body2">
          <FormattedMessage id="ui.trendingPeople.noResults" defaultMessage="ui.trendingPeople.noResults" />
        </Typography>
      ) : (
        <React.Fragment>
          <List>
            {people.slice(0, visiblePeople).map((user) => (
              <ListItem key={user.id}>
                <User
                  elevation={0}
                  user={user}
                  className={classes.trendingUserItem}
                  {...(followEnabled
                    ? {followConnectUserButtonProps: {onFollow: handleFollowersUpdate}}
                    : {followConnectUserButtonProps: {onChangeConnectionStatus: handleFollowersUpdate}})}
                  {...UserProps}
                />
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      )}
      {hasMore && (
        <Button size="small" className={classes.showMore} onClick={() => setOpenTrendingPeopleDialog(true)}>
          <FormattedMessage id="ui.trendingPeople.button.showAll" defaultMessage="ui.trendingPeople.button.showAll" />
        </Button>
      )}
      {openTrendingPeopleDialog && (
        <BaseDialog
          title={<FormattedMessage defaultMessage="ui.trendingPeople.title" id="ui.trendingPeople.title" />}
          onClose={() => setOpenTrendingPeopleDialog(false)}
          open={openTrendingPeopleDialog}>
          {loading ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={people.length}
              next={fetchTrendingPeople}
              hasMoreNext={Boolean(next)}
              loaderNext={<CentralProgress size={30} />}
              height={isMobile ? '100vh' : 400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.trendingPeople.noMoreResults" defaultMessage="ui.trendingPeople.noMoreResults" />
                  </b>
                </p>
              }>
              <List>
                {people.map((p, index) => (
                  <ListItem key={p.id}>
                    <User
                      elevation={0}
                      user={p}
                      className={classes.trendingUserItem}
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
    </CardContent>
  );

  /**
   * Renders root object (if results and autoHide prop is set to false, otherwise component is hidden)
   */
  if (autoHide && !total) {
    return <HiddenPlaceholder />;
  }
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {p}
    </Root>
  );
}
