import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {Link, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import {getContribute, getContributeType, getContributionSnippet, getRouteData, getContributionRouteName} from '../../../utils/contribute';
import {red} from '@mui/material/colors';
import classNames from 'classnames';
import {NotificationObjectTemplateType} from '../../../types/notification';

const messages = defineMessages({
  appreciated: {
    id: 'ui.notification.voteUp.appreciated',
    defaultMessage: 'ui.notification.voteUp.appreciated'
  }
});

const PREFIX = 'SCVoteUpNotification';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  avatarWrap: `${PREFIX}-avatar-wrap`,
  avatar: `${PREFIX}-avatar`,
  avatarSnippet: `${PREFIX}-avatar-snippet`,
  username: `${PREFIX}-username`,
  voteUpText: `${PREFIX}-vote-up-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionText: `${PREFIX}-contribution-text`,
  toastInfo: `${PREFIX}-toast-info`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
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
  [`& .${classes.voteUpText}`]: {
    display: 'inline',
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  },
  [`& .${classes.toastInfo}`]: {
    marginTop: 10
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
 * This component render the content of the notification of type vote up
 * @param props
 * @constructor
 */
export default function VoteUpNotification(props: NotificationVoteUpProps): JSX.Element {
  // PROPS
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = NotificationObjectTemplateType.DETAIL,
    index,
    onVote,
    loadingVote,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === NotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === NotificationObjectTemplateType.TOAST;
  const contribution = getContribute(notificationObject);
  const contributionType = getContributeType(notificationObject);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <ListItem
        alignItems={isSnippetTemplate ? 'center' : 'flex-start'}
        component={'div'}
        classes={{
          root: classNames({
            [classes.listItemSnippet]: isToastTemplate || isSnippetTemplate,
            [classes.listItemSnippetNew]: isSnippetTemplate && notificationObject.is_new
          })
        }}>
        <ListItemAvatar classes={{root: classes.avatarWrap}}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>
            <Avatar
              alt={notificationObject.user.username}
              variant="circular"
              src={notificationObject.user.avatar}
              classes={{root: classNames(classes.avatar, {[classes.avatarSnippet]: isSnippetTemplate})}}
            />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {template === NotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
              <Typography component="div" className={classes.voteUpText} color="inherit">
                <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)} className={classes.username}>
                  {notificationObject.user.username}
                </Link>{' '}
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
              {template === NotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
            </Box>
          }
        />
      </ListItem>
      {template === NotificationObjectTemplateType.TOAST && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <DateTimeAgo date={notificationObject.active_at} />
          <Typography color="primary">
            <Link to={scRoutingContext.url(getContributionRouteName(contribution), getRouteData(contribution))}>
              <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
            </Link>
          </Typography>
        </Stack>
      )}
    </Root>
  );
}
