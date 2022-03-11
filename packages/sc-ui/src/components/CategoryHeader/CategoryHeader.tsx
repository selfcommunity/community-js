import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, AvatarGroup, Box, Button, Chip, Divider, Grid, List, Paper, Typography} from '@mui/material';
import FollowCategoryButton, {FollowCategoryButtonProps} from '../FollowCategoryButton';
import {AxiosResponse} from 'axios';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import User from '../User';
import Icon from '@mui/material/Icon';
import {Endpoints, http, SCCategoryType, SCUserContext, SCUserContextType, SCUserType, useSCFetchCategory} from '@selfcommunity/core';
import AvatarGroupSkeleton from '../Skeleton/AvatarGroupSkeleton';
import classNames from 'classnames';

const messages = defineMessages({
  followedBy: {
    id: 'ui.categoryHeader.followedBy',
    defaultMessage: 'ui.categoryHeader.followedBy'
  }
});

const PREFIX = 'SCCategoryHeader';

const classes = {
  root: `${PREFIX}-root`,
  cover: `${PREFIX}-cover`,
  name: `${PREFIX}-name`,
  slogan: `${PREFIX}-slogan`,
  info: `${PREFIX}-info`,
  followedByCounter: `${PREFIX}-followed-by-counter`,
  followedByAvatars: `${PREFIX}-followed-by-avatars`,
  divider: `${PREFIX}-divider`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.cover}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 270,
    color: '#FFF',
    background: 'linear-gradient(180deg, rgba(177,177,177,1) 0%, rgba(255,255,255,1) 90%)'
  },
  [`& .${classes.name}`]: {
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  [`& .${classes.slogan}`]: {
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  ['& .MuiAvatar-root']: {
    color: '#FFF',
    border: '2px solid #FFF',
    fontSize: 11
  },
  [`& .${classes.info}`]: {
    marginTop: 0.5,
    padding: 3,
    flexDirection: 'column',
    alignItems: 'center'
  },
  [`& .${classes.followedByCounter}`]: {
    display: 'inline',
    marginLeft: 10
  }
}));

export interface CategoryHeaderProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Category Object
   * @default null
   */
  category?: SCCategoryType;
  /**
   * Id of category object
   * @default null
   */
  categoryId?: number;

  /**
   * Props to spread category button followed
   * @default {}
   */
  FollowCategoryButtonProps?: FollowCategoryButtonProps;

  /**
   * Props to spread to followedBy dialog
   * @default {}
   */
  FollowedByDialogProps?: BaseDialogProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-UI Category Header component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoryHeader} from '@selfcommunity/ui';
 ```
 #### Component Name

 The name `SCCategoryHeader` can be used when providing style overrides in the theme.

 * #### CSS
 *
 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryHeader-root|Styles applied to the root element.|

 * @param props
 */
export default function CategoryHeader(props: CategoryHeaderProps): JSX.Element {
  // PROPS
  const {className, categoryId, category, FollowCategoryButtonProps = {}, FollowedByDialogProps = {}, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);

  // STATE
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [total, setTotal] = useState<number>(0);
  const [followers, setFollowers] = useState<SCUserType[]>([]);
  const [openFollowersDialog, setOpenFollowersDialog] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  /**
   * If id attempts to get the category by id
   */
  useEffect(() => {
    if (scCategory) {
      fetchFollowers();
    }
  }, [scCategory]);

  /**
   * Memoized fetchFollowers
   */
  const fetchFollowers = useMemo(
    () => () => {
      http
        .request({
          url: next ? next : Endpoints.CategoryFollowers.url({id: scCategory.id}),
          method: Endpoints.CategoryFollowers.method
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          setFollowers([...followers, ...res.data.results]);
          setTotal(res.data['count']);
          setNext(res.data['next']);
          setLoading(false);
          return Promise.resolve(res.data);
        });
    },
    [scCategory, next]
  );

  /**
   * Opens dialog votes
   */
  function handleToggleFollowersDialog() {
    setOpenFollowersDialog((prev) => !prev);
  }

  /**
   * Handles callback follow/unfollow category
   */
  function handleFollowCategory(category, follow) {
    let _followers = [];
    if (follow) {
      // if I follow him now I add at the head of the group
      _followers = [...[scUserContext.user], ...followers];
    } else {
      // if now I don't follow category anymore
      // I remove my avatar from the visible group
      if (total < 5) {
        _followers = [...followers.filter((u) => u.id !== scUserContext.user.id)];
      } else {
        const _pFollowers = followers.slice(0, 5).filter((u) => u.id !== scUserContext.user.id);
        _followers = [..._pFollowers, ...followers.slice(5)];
      }
    }
    setTotal((prev) => prev + (follow ? 1 : -1));
    setFollowers(_followers);
    setNext(null);
  }

  /**
   * If not category object returns null
   */
  if (!scCategory) {
    return null;
  }

  const _backgroundCover = {
    ...(scCategory ? {background: `url('${scCategory.image_bigger}') center / cover`} : {})
  };

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}} />
      <Grid container spacing={2} className={classes.info}>
        <Grid item xs={6}>
          <Typography variant={'h3'} align={'center'} className={classes.name} gutterBottom>
            {scCategory.name}
          </Typography>
          {scCategory.slogan && (
            <Typography variant={'h5'} align={'center'} className={classes.slogan}>
              {scCategory.slogan}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} className={classes.followedByAvatars}>
          <Typography className={classes.followedByCounter} component="div">
            {intl.formatMessage(messages.followedBy, {total: total})}
          </Typography>
          {loading && !scCategory ? (
            <AvatarGroupSkeleton {...rest} />
          ) : (
            <>
              {total > 0 ? (
                <Button onClick={handleToggleFollowersDialog} disabled={loading || !scCategory}>
                  <AvatarGroup {...rest}>
                    {followers.map((c: SCUserType) => (
                      <Avatar key={c.id} alt={c.username} src={c.avatar} />
                    ))}
                    {[...Array(Math.max(0, total - followers.length))].map(
                      (
                        x,
                        i // Add max to 0 to prevent creation of array with negative index during state update
                      ) => (
                        <Avatar key={i}></Avatar>
                      )
                    )}
                  </AvatarGroup>
                </Button>
              ) : (
                'No users followed this category'
              )}
            </>
          )}
        </Grid>
        <Grid item xs={6}>
          <FollowCategoryButton category={scCategory} onFollow={handleFollowCategory} {...FollowCategoryButtonProps} />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      {openFollowersDialog && (
        <BaseDialog
          title={
            <>
              <FormattedMessage defaultMessage="ui.categoryHeader.followers" id="ui.categoryHeader.followers" /> ({total})
            </>
          }
          onClose={handleToggleFollowersDialog}
          open={openFollowersDialog}
          {...FollowedByDialogProps}>
          {loading ? (
            <CentralProgress size={50} />
          ) : (
            <InfiniteScroll
              dataLength={total}
              next={fetchFollowers}
              hasMore={next !== null}
              loader={<CentralProgress size={30} />}
              height={400}
              endMessage={
                <p style={{textAlign: 'center'}}>
                  <b>
                    <FormattedMessage id="ui.categoryHeader.noOtherFollowers" defaultMessage="ui.categoryHeader.noOtherFollowers" />
                  </b>
                </p>
              }>
              <List>
                {followers.map((follower, index) => (
                  <User elevation={0} user={follower} key={index} />
                ))}
              </List>
            </InfiniteScroll>
          )}
        </BaseDialog>
      )}
    </Root>
  );
}
