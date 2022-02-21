import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCCommentTypologyType, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import {getRouteData, getContributeType, getContributionSnippet} from '../../../utils/contribute';
import {red} from '@mui/material/colors';
import classNames from 'classnames';

const messages = defineMessages({
  appreciated: {
    id: 'ui.notification.voteUp.appreciated',
    defaultMessage: 'ui.notification.voteUp.appreciated'
  }
});

const PREFIX = 'SCVoteUpNotification';

const classes = {
  root: `${PREFIX}-root`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  voteUpText: `${PREFIX}-vote-up-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
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
  [`& .${classes.voteUpText}`]: {
    display: 'inline',
    fontWeight: '600'
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  }
}));

export interface NotificationVoteUpProps {
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
 * This component render the content of the notification of type vote up
 * @param props
 * @constructor
 */
export default function VoteUpNotification(props: NotificationVoteUpProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, index, onVote, loadingVote, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // Contribution
  const contributionType = getContributeType(notificationObject);
  const feedObjectType = contributionType === SCCommentTypologyType ? getContributeType(notificationObject[contributionType]) : contributionType;
  const feedObjectId =
    contributionType === SCCommentTypologyType ? notificationObject[SCCommentTypologyType][feedObjectType] : notificationObject[contributionType].id;

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
              <Typography component="div" className={classes.voteUpText} color="inherit">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>{notificationObject.user.username}</Link>{' '}
                {intl.formatMessage(messages.appreciated, {
                  username: notificationObject.user.username,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </Typography>
            </>
          }
          secondary={
            <Box className={classes.contributionWrap}>
              <Link
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}>
                <Typography variant="body2" className={classes.contributionText} gutterBottom>
                  {getContributionSnippet(notificationObject[contributionType])}
                </Typography>
              </Link>
              <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            </Box>
          }
        />
      </ListItem>
    </Root>
  );
}
