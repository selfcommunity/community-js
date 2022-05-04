import React, {useMemo, useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import LoadingButton from '@mui/lab/LoadingButton';
import {styled} from '@mui/material/styles';
import {Box, Tooltip} from '@mui/material';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import classNames from 'classnames';
import {useSnackbar} from 'notistack';
import Icon from '@mui/material/Icon';
import {
  Endpoints,
  http,
  Logger,
  SCContextType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCTagType,
  SCUserContextType,
  useSCContext,
  useSCFetchFeedObject,
  useSCUser
} from '@selfcommunity/core';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCFollowObject';

const classes = {
  root: `${PREFIX}-root`,
  followButton: `${PREFIX}-follow-button`,
  iconizedButton: `${PREFIX}-button-iconized`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.followButton}`]: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[700],
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
      boxShadow: 'none'
    }
  },
  [`& .${classes.iconizedButton}`]: {
    minWidth: 45
  }
}));

export interface FollowProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed object id
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed object type
   * @default 'post' type
   */
  feedObjectType?: SCFeedObjectTypologyType;

  /**
   * Handle follow object
   * @param isFollow
   */
  handleFollow: (isFollow) => void;

  /**
   * Iconized Button
   */
  iconizedButton?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Follow(inProps: FollowProps): JSX.Element {
  // PROPS
  const props: FollowProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    handleFollow,
    iconizedButton = true,
    ...rest
  } = props;

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  /**
   * Perform follow/unfollow
   * Post, Discussion, Status
   */
  const performFollow = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.FollowContribution.url({type: obj.type, id: obj.id}),
          method: Endpoints.FollowContribution.method
        })
        .then((res: AxiosResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Handle follow object
   * Even if a user is blocked, can perform this action
   */
  function follow() {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      setIsFollowing(true);
      performFollow()
        .then((data) => {
          const isFollow = !obj.followed;
          setObj(Object.assign({}, obj, {followed: isFollow}));
          setIsFollowing(false);
          handleFollow && handleFollow(isFollow);
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        });
    }
  }

  /**
   * Renders vote action if withAction==true
   * @return {JSX.Element}
   */
  function renderFollowButton() {
    let btnLabel = <FormattedMessage id="ui.feedObject.follow" defaultMessage="ui.feedObject.follow" />;
    if (obj.followed) {
      btnLabel = <FormattedMessage id="ui.feedObject.unfollow" defaultMessage="ui.feedObject.unfollow" />;
    }
    return (
      <React.Fragment>
        {scUserContext.user && obj.author.id !== scUserContext.user.id && !obj.deleted && (
          <Tooltip title={btnLabel}>
            <LoadingButton
              classes={{root: classNames(classes.followButton, {[classes.iconizedButton]: classes.iconizedButton})}}
              loading={isFollowing}
              variant={iconizedButton ? 'text' : 'contained'}
              size="small"
              disabled={isFollowing}
              onClick={follow}>
              {obj.followed ? (
                <>
                  {iconizedButton ? (
                    <Icon fontSize="large" color="primary">
                      bookmark_added
                    </Icon>
                  ) : (
                    btnLabel
                  )}
                </>
              ) : (
                <>{iconizedButton ? <Icon fontSize="large">bookmark_border</Icon> : btnLabel}</>
              )}
            </LoadingButton>
          </Tooltip>
        )}
      </React.Fragment>
    );
  }

  /**
   * Renders share action
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {renderFollowButton()}
    </Root>
  );
}
