import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCNotificationMentionType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import {getRouteData, getContributeType, getContributionSnippet} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {red} from '@mui/material/colors';

const messages = defineMessages({
  quotedYouOn: {
    id: 'ui.notification.mention.quotedYou',
    defaultMessage: 'ui.notification.mention.quotedYou'
  }
});

const PREFIX = 'SCUserNotificationMention';

const classes = {
  root: `${PREFIX}-root`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  mentionText: `${PREFIX}-mention-text`,
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
  [`& .${classes.mentionText}`]: {
    display: 'inline',
    fontWeight: '600'
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  }
}));

export interface NotificationMentionProps {
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
  notificationObject: SCNotificationMentionType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type mention
 * @param props
 * @constructor
 */
export default function UserNotificationMention(props: NotificationMentionProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const objectType = getContributeType(notificationObject);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[objectType].author)}>
            <Avatar
              alt={notificationObject[objectType].author.username}
              variant="circular"
              src={notificationObject[objectType].author.avatar}
              classes={{root: classes.avatar}}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}
              <Typography component="span" className={classes.mentionText} color="inherit">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[objectType].author)}>
                  {notificationObject[objectType].author.username}
                </Link>{' '}
                {intl.formatMessage(messages.quotedYouOn, {
                  b: (...chunks) => <strong>{chunks}</strong>
                })}{' '}
              </Typography>
            </>
          }
          secondary={
            <div>
              <Link to={scRoutingContext.url(SCRoutes[`${objectType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[objectType]))}>
                <Typography component={'span'} variant="body2" className={classes.contributionText} gutterBottom>
                  {getContributionSnippet(notificationObject[objectType])}
                </Typography>
              </Link>
              <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt}/>
            </div>
          }
        />
      </ListItem>
    </Root>
  );
}
