import React, {useContext, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import List from '@mui/material/List';
import {Button, Typography} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import PeopleSuggestionSkeleton from '../PeopleSuggestion/Skeleton';
import User, {UserProps} from '../User';
import {AxiosResponse} from 'axios';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import classNames from 'classnames';
import {SCOPE_SC_UI} from '../../constants/Errors';
import BaseDialog from '../../shared/BaseDialog';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';

const messages = defineMessages({
  userFollowers: {
    id: 'ui.userFollowers.userFollowers',
    defaultMessage: 'ui.userFollowers.userFollowers'
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
  noResults: `${PREFIX}-noResults`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  maxWidth: 700,
  marginBottom: theme.spacing(2)
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
 * > API documentation for the Community-UI User Followers component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserFollowers} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCUserFollowers` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserFollowers-root|Styles applied to the root element.|

 * @param props
 */
export default function UserFollowers(props: UserFollowersProps): JSX.Element {
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
  const {userId, autoHide, className, UserProps = {}} = props;

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
        .then((res: AxiosResponse<any>) => {
          const data = res.data;
          setFollowers([...followers, ...data.results]);
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
   * On mount, fetches the list of users followers
   */
  useEffect(() => {
    if (!contentAvailability && !scUserContext.user) {
      return;
    }
    fetchFollowers();
  }, [scUserContext.user]);

  /**
   * Renders the list of users followers
   */
  const u = (
    <React.Fragment>
      {loading ? (
        <PeopleSuggestionSkeleton elevation={0} />
      ) : (
        <CardContent>
          {!total ? (
            <Typography className={classes.noResults} variant="body2">{`${intl.formatMessage(messages.noFollowers)}`}</Typography>
          ) : (
            <React.Fragment>
              <Typography className={classes.title} variant="body1">{`${intl.formatMessage(messages.userFollowers, {total: total})}`}</Typography>
              <List>
                {followers.slice(0, visibleUsers).map((user: SCUserType, index) => (
                  <div key={index}>
                    <User elevation={0} user={user} key={user.id} {...UserProps} />
                  </div>
                ))}
              </List>
              {hasMore && (
                <Button size="small" onClick={() => setOpenUserFollowersDialog(true)}>
                  <FormattedMessage id="ui.userFollowers.button.showAll" defaultMessage="ui.userFollowers.button.showAll" />
                </Button>
              )}
              {openUserFollowersDialog && (
                <BaseDialog
                  title={<FormattedMessage defaultMessage="ui.userFollowers.title" id="ui.userFollowers.title" />}
                  onClose={() => setOpenUserFollowersDialog(false)}
                  open={openUserFollowersDialog}>
                  {loading ? (
                    <CentralProgress size={50} />
                  ) : (
                    <InfiniteScroll
                      dataLength={followers.length}
                      next={fetchFollowers}
                      hasMore={Boolean(next)}
                      loader={<CentralProgress size={30} />}
                      height={400}
                      endMessage={
                        <p style={{textAlign: 'center'}}>
                          <b>
                            <FormattedMessage id="ui.userFollowers.noMoreFollowers" defaultMessage="ui.userFollowers.noMoreFollowers" />
                          </b>
                        </p>
                      }>
                      <List>
                        {followers.map((f, index) => (
                          <User elevation={0} user={f} key={f.id} sx={{m: 0}} {...UserProps} />
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
   * Renders root object
   */
  if (autoHide && !total) {
    return null;
  }
  if (!contentAvailability && !scUserContext.user) {
    return null;
  }
  return <Root className={classNames(classes.root, className)}>{u}</Root>;
}
