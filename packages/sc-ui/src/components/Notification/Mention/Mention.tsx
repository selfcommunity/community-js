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
import {NotificationObjectTemplateType} from '../../../types';

const messages = defineMessages({
  quotedYouOn: {
    id: 'ui.notification.mention.quotedYou',
    defaultMessage: 'ui.notification.mention.quotedYou'
  }
});

const PREFIX = 'SCUserNotificationMention';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  avatarSnippet: `${PREFIX}-avatar-snippet`,
  mentionText: `${PREFIX}-mention-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
  [`& .${classes.listItemSnippet}`]: {
    padding: '0px 5px',
    alignItems: 'center'
  },
  [`& .${classes.listItemSnippetNew}`]: {
    borderLeft: '2px solid red'
  },
  [`& .${classes.avatarWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.avatar}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.avatarSnippet}`]: {
    width: 30,
    height: 30
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
   * Notification Object template type
   * @default 'preview'
   */
  template?: NotificationObjectTemplateType;

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
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = NotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === NotificationObjectTemplateType.SNIPPET;
  const objectType = getContributeType(notificationObject);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem
        alignItems={isSnippetTemplate ? 'center' : 'flex-start'}
        component={'div'}
        classes={{root: classNames({[classes.listItemSnippet]: isSnippetTemplate, [classes.listItemSnippetNew]: notificationObject.is_new})}}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[objectType].author)}>
            <Avatar
              alt={notificationObject[objectType].author.username}
              variant="circular"
              src={notificationObject[objectType].author.avatar}
              classes={{root: classNames(classes.avatar, {[classes.avatarSnippet]: isSnippetTemplate})}}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {!isSnippetTemplate && notificationObject.is_new && <NewChip />}
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
              {!isSnippetTemplate && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
            </div>
          }
        />
      </ListItem>
    </Root>
  );
}
