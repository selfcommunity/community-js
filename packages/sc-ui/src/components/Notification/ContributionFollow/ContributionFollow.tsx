import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';
import classNames from 'classnames';
import {red} from '@mui/material/colors';

const messages = defineMessages({
  contributionFollow: {
    id: 'ui.notification.contributionFollow.follow',
    defaultMessage: 'ui.notification.contributionFollow.follow'
  }
});

const PREFIX = 'SCContributionFollowNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  followText: `${PREFIX}-mention-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.followText}`]: {
    display: 'inline',
    fontWeight: '600'
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  },
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export interface ContributionFollowProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.sid>`
   */
  id?: string;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationVoteUpType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type follow (contribution)
 * @param props
 * @constructor
 */
export default function ContributionFollowNotification(props: ContributionFollowProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>
            <Avatar alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} classes={{root: classes.avatar}} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}
              <Typography component="div" className={classes.followText} color="inherit">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>{notificationObject.user.username}</Link>{' '}
                {intl.formatMessage(messages.contributionFollow, {
                  username: notificationObject.user.username,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </Typography>
            </>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
        />
      </ListItem>
    </Root>
  );
}
