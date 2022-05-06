import React, {useContext, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, AvatarGroup, Box, Button, Chip, Divider, Grid, List, ListItem, Paper, Typography} from '@mui/material';
import FollowCategoryButton, {FollowCategoryButtonProps} from '../FollowCategoryButton';
import {AxiosResponse} from 'axios';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import CentralProgress from '../../shared/CentralProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import User from '../User';
import {http, Endpoints} from '@selfcommunity/api-services';
import {SCUserContext, SCUserContextType, useSCFetchCategory} from '@selfcommunity/react-core';
import {SCCategoryType, SCUserType} from '@selfcommunity/types';
import AvatarGroupSkeleton from '../Skeleton/AvatarGroupSkeleton';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

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
  followedCounter: `${PREFIX}-followed-counter`,
  followed: `${PREFIX}-followed`,
  action: `${PREFIX}-action`
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
  [`& .${classes.info}`]: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  [`& .${classes.name}, & .${classes.slogan}`]: {
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  },
  [`& .${classes.followed}, & .${classes.action}`]: {
    textAlign: 'center',
    marginBottom: theme.spacing(2)
  },
  [`& .${classes.followed} .MuiAvatar-root`]: {
    color: '#FFF',
    border: '2px solid #FFF',
    fontSize: 11
  },
  [`& .${classes.followedCounter}`]: {
    display: 'inline'
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
 import {CategoryHeader} from '@selfcommunity/react-ui';
 ```
 #### Component Name

 The name `SCCategoryHeader` can be used when providing style overrides in the theme.

 * #### CSS
 *
 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryHeader-root|Styles applied to the root element.|
 |cover|.SCCategoryHeader-cover|Styles applied to the cover element.|
 |name|.SCCategoryHeader-name|Styles applied to the name element.|
 |slogan|.SCCategoryHeader-slogan|Styles applied to the slogan element.|
 |info|.SCCategoryHeader-info|Styles applied to the info element.|
 |followedCounter|.SCCategoryHeader-followed-by-counter|Styles applied to the followers counter element.|
 |followed|.SCCategoryHeader-followed|Styles applied to the followers avatars section.|
 |action|.SCCategoryHeader-action|Styles applied to the action section.|

 * @param inProps
 */
export default function CategoryHeader(inProps: CategoryHeaderProps): JSX.Element {
  // PROPS
  const props: CategoryHeaderProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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
    ...(scCategory ? {background: `url('${scCategory.emotional_image_original}') center / cover`} : {})
  };

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Paper style={_backgroundCover} classes={{root: classes.cover}} />
      <Box className={classes.info}>
        <Typography variant="h3" className={classes.name} gutterBottom>
          {scCategory.name}
        </Typography>
        {scCategory.slogan && (
          <Typography variant="h5" className={classes.slogan}>
            {scCategory.slogan}
          </Typography>
        )}
        <Box className={classes.followed}>
          <Typography className={classes.followedCounter} component="div">
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
        </Box>
        <Box className={classes.action}>
          <FollowCategoryButton category={scCategory} onFollow={handleFollowCategory} {...FollowCategoryButtonProps} />
        </Box>
      </Box>
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
                  <ListItem key={follower.id}>
                    <User elevation={0} user={follower} key={index} />
                  </ListItem>
                ))}
              </List>
            </InfiniteScroll>
          )}
        </BaseDialog>
      )}
    </Root>
  );
}
