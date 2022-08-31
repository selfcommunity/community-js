import {Box, MenuItem, styled, Typography} from '@mui/material';
import {Link, SCUserContext, SCUserContextType} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import React, {useContext} from 'react';
import {useThemeProps} from '@mui/system';
import {SCHeaderMenuUrlsType} from '../../types';
import classNames from 'classnames';
import {UserService} from '@selfcommunity/api-services';

const PREFIX = 'SCHeaderMenu';

const classes = {
  root: `${PREFIX}-root`,
  menuItem: `${PREFIX}-menu-item`
};
const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface HeaderMenuProps {
  /**
   * Callback fired on menu item click
   */
  onItemClick?: () => void;
  /**
   * The single pages url
   */
  url?: SCHeaderMenuUrlsType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Other props
   */
  [p: string]: any;
}

export default function HeaderMenu(inProps: HeaderMenuProps) {
  // PROPS
  const props: HeaderMenuProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {onItemClick, className, url, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useContext(SCUserContext);
  const roles = scUserContext.user && scUserContext.user.role;
  const isAdmin = roles && roles.includes('admin');
  const isModerator = roles && roles.includes('moderator');

  /**
   * Fetches paltform url
   * @param query
   */
  const fetchPlatform = (query) => {
    UserService.getCurrentUserPlatform(query).then((res) => {
      const platformUrl = res.platform_url;
      window.open(platformUrl, '_blank').focus();
    });
  };

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {url && url.profile && (
        <MenuItem className={classes.menuItem} key={'profile'} component={Link} to={url.profile} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.profile" defaultMessage="ui.header.menuItem.profile" />
          </Typography>
        </MenuItem>
      )}
      {url && url.interests && (
        <MenuItem className={classes.menuItem} key={'categories'} component={Link} to={url.interests} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.interests" defaultMessage="ui.header.menuItem.interests" />
          </Typography>
        </MenuItem>
      )}
      {url && url.followings && (
        <MenuItem className={classes.menuItem} key={'followings'} component={Link} to={url.followings} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.followings" defaultMessage="ui.header.menuItem.followings" />
          </Typography>
        </MenuItem>
      )}

      {url && url.followers && (
        <MenuItem className={classes.menuItem} key={'followers'} component={Link} to={url.followers} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.followers" defaultMessage="ui.header.menuItem.followers" />
          </Typography>
        </MenuItem>
      )}
      {url && url.posts && (
        <MenuItem className={classes.menuItem} key={'userPosts'} component={Link} to={url.posts} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.posts" defaultMessage="ui.header.menuItem.posts" />
          </Typography>
        </MenuItem>
      )}
      {url && url.comments && (
        <MenuItem className={classes.menuItem} key={'comments'} component={Link} to={url.comments} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.comments" defaultMessage="ui.header.menuItem.comments" />
          </Typography>
        </MenuItem>
      )}
      {url && url.loyalty && (
        <MenuItem className={classes.menuItem} key={'loyaltyProgram'} component={Link} to={url.loyalty} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.loyalty" defaultMessage="ui.header.menuItem.loyalty" />
          </Typography>
        </MenuItem>
      )}
      {url && url.followedPosts && (
        <MenuItem className={classes.menuItem} key={'followedPosts'} component={Link} to={url.followedPosts} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.postsFollowed" defaultMessage="ui.header.menuItem.postsFollowed" />
          </Typography>
        </MenuItem>
      )}
      {url && url.peopleSuggestion && (
        <MenuItem className={classes.menuItem} key={'suggestedPeople'} component={Link} to={url.peopleSuggestion} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.interestingPeople" defaultMessage="ui.header.menuItem.interestingPeople" />
          </Typography>
        </MenuItem>
      )}
      {url && url.messages && (
        <MenuItem className={classes.menuItem} key={'privateMessages'} component={Link} to={url.messages} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.privateMessages" defaultMessage="ui.header.menuItem.privateMessages" />
          </Typography>
        </MenuItem>
      )}
      {isAdmin && (
        <Box>
          <MenuItem className={classes.menuItem} key={'platform'} onClick={() => fetchPlatform('')}>
            <Typography textAlign="center">
              <FormattedMessage id="ui.header.menuItem.platform" defaultMessage="ui.header.menuItem.platform" />
            </Typography>
          </MenuItem>
          {url && url.communityTour && (
            <MenuItem className={classes.menuItem} key={'communityTour'} component={Link} to={url.communityTour} onClick={onItemClick}>
              <Typography textAlign="center">
                <FormattedMessage id="ui.header.menuItem.communityTour" defaultMessage="ui.header.menuItem.communityTour" />
              </Typography>
            </MenuItem>
          )}
        </Box>
      )}
      {(isModerator || isAdmin) && (
        <Box>
          <MenuItem className={classes.menuItem} key={'moderation'} onClick={() => fetchPlatform('/moderation')}>
            <Typography textAlign="center">
              <FormattedMessage id="ui.header.menuItem.moderation" defaultMessage="ui.header.menuItem.moderation" />
            </Typography>
          </MenuItem>
        </Box>
      )}
      {url && url.settings && (
        <MenuItem className={classes.menuItem} key={'settings'} component={Link} to={url.settings} onClick={onItemClick}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.settings" defaultMessage="ui.header.menuItem.settings" />
          </Typography>
        </MenuItem>
      )}
      {url && url.logout && (
        <MenuItem className={classes.menuItem} key={'logout'} onClick={url.logout}>
          <Typography textAlign="center">
            <FormattedMessage id="ui.header.menuItem.logout" defaultMessage="ui.header.menuItem.logout" />
          </Typography>
        </MenuItem>
      )}
    </Root>
  );
}
