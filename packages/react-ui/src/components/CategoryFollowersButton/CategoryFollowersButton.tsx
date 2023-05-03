import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, AvatarGroup, Button, List, ListItem, Typography, useTheme} from '@mui/material';
import BaseDialog, {BaseDialogProps} from '../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';
import InfiniteScroll from '../../shared/InfiniteScroll';
import User, {UserSkeleton} from '../User';
import {CategoryService, Endpoints, http, HttpResponse, SCPaginatedResponse} from '@selfcommunity/api-services';
import {SCThemeType, useSCFetchCategory} from '@selfcommunity/react-core';
import {SCCategoryType, SCUserType} from '@selfcommunity/types';
import AvatarGroupSkeleton from '../Skeleton/AvatarGroupSkeleton';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ButtonProps} from '@mui/material/Button/Button';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useDeepCompareEffectNoCheck} from 'use-deep-compare-effect';

const PREFIX = 'SCCategoryFollowersButton';

const classes = {
  root: `${PREFIX}-root`,
  dialogRoot: `${PREFIX}-dialog-root`,
  endMessage: `${PREFIX}-end-message`
};

const Root = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const DialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(({theme}) => ({}));

export interface CategoryFollowersButtonProps extends Pick<ButtonProps, Exclude<keyof ButtonProps, 'onClick' | 'disabled'>> {
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
   * Props to spread to followedBy dialog
   * @default {}
   */
  DialogProps?: BaseDialogProps;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 *> API documentation for the Community-JS Category Followers Button component. Learn about the available props and the CSS API.
 *
 #### Import
 ```jsx
 import {CategoryFollowersButton} from '@selfcommunity/react-ui';
 ```
 #### Component Name

 The name `SCCategoryFollowersButton` can be used when providing style overrides in the theme.

 * #### CSS
 *
 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategoryFollowersButton-root|Styles applied to the root element.|
 |dialogRoot|.SCCategoryFollowersButton-dialog-root|Styles applied to the root element.|
 |endMessage|.SCCategoriesFollowedWidget-end-message|Styles applied to the end message element.|

 * @param inProps
 */
export default function CategoryFollowersButton(inProps: CategoryFollowersButtonProps): JSX.Element {
  // PROPS
  const props: CategoryFollowersButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  const {className, categoryId, category, DialogProps = {}, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const [followers, setFollowers] = useState<SCUserType[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  // HOOKS
  const {scCategory, setSCCategory} = useSCFetchCategory({id: categoryId, category});

  // FETCH FIRST FOLLOWERS
  useDeepCompareEffectNoCheck(() => {
    console.log(scCategory);
    if (!scCategory) {
      return;
    }
    if (followers.length === 0) {
      console.log('getCategoryFollowers');
      CategoryService.getCategoryFollowers(scCategory.id, {limit: 3}).then((res: SCPaginatedResponse<SCUserType>) => {
        setFollowers([...res.results]);
        setOffset(3);
        setLoading(false);
      });
    } else {
      setOffset(0);
    }
  }, [scCategory]);

  useEffect(() => {
    if (open && offset !== null) {
      setLoading(true);
      CategoryService.getCategoryFollowers(scCategory.id, {offset, limit: 20}).then((res: SCPaginatedResponse<SCUserType>) => {
        setFollowers([...(offset === 0 ? [] : followers), ...res.results]);
        setNext(res.next);
        setLoading(false);
        setOffset(null);
      });
    }
  }, [open, followers, offset]);

  /**
   * Memoized fetchFollowers
   */
  const fetchFollowers = useMemo(
    () => () => {
      if (!next) {
        return;
      }
      http
        .request({
          url: next,
          method: Endpoints.CategoryFollowers.method
        })
        .then((res: HttpResponse<any>) => {
          setFollowers([...followers, ...res.data.results]);
          setNext(res.data.next);
        })
        .catch((error) => Logger.error(SCOPE_SC_UI, error))
        .then(() => setLoading(false));
    },
    [followers, scCategory, next]
  );

  /**
   * Opens dialog votes
   */
  function handleToggleDialogOpen() {
    setOpen((prev) => !prev);
  }

  // RENDER
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Root
        className={classNames(classes.root, className)}
        onClick={handleToggleDialogOpen}
        disabled={loading || !scCategory || scCategory.followers_counter === 0}
        {...rest}>
        {loading || !scCategory ? (
          <AvatarGroupSkeleton {...rest} />
        ) : (
          <AvatarGroup total={scCategory.followers_counter}>
            {followers.map((c: SCUserType) => (
              <Avatar key={c.id} alt={c.username} src={c.avatar} />
            ))}
          </AvatarGroup>
        )}
      </Root>
      {open && (
        <DialogRoot
          className={classes.dialogRoot}
          title={
            <FormattedMessage
              defaultMessage="ui.categoryFollowersButton.dialogTitle"
              id="ui.categoryFollowersButton.dialogTitle"
              values={{total: scCategory.followers_counter}}
            />
          }
          onClose={handleToggleDialogOpen}
          open={open}
          {...DialogProps}>
          <InfiniteScroll
            dataLength={followers.length}
            next={fetchFollowers}
            hasMoreNext={next !== null || loading}
            loaderNext={<UserSkeleton elevation={0} />}
            height={isMobile ? '100%' : 400}
            endMessage={
              <Typography className={classes.endMessage}>
                <FormattedMessage id="ui.categoryFollowersButton.noOtherFollowers" defaultMessage="ui.categoryFollowersButton.noOtherFollowers" />
              </Typography>
            }>
            <List>
              {followers.map((follower, index) => (
                <ListItem key={follower.id}>
                  <User elevation={0} user={follower} />
                </ListItem>
              ))}
            </List>
          </InfiniteScroll>
        </DialogRoot>
      )}
    </>
  );
}
