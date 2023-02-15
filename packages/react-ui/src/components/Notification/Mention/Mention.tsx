import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationMentionType} from '@selfcommunity/types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getRouteData, getContributionType, getContributionSnippet, getContribution} from '../../../utils/contribution';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';

const messages = defineMessages({
  quotedYouOn: {
    id: 'ui.notification.mention.quotedYou',
    defaultMessage: 'ui.notification.mention.quotedYou'
  }
});

const PREFIX = 'SCNotificationMention';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  username: `${PREFIX}-username`,
  mentionText: `${PREFIX}-mention-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.username}`]: {
    fontWeight: 700,
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  [`& .${classes.mentionText}`]: {
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionText}`]: {
    '&:hover': {
      textDecoration: 'underline'
    },
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden'
  }
}));

export interface MentionNotificationProps
  extends Pick<
    NotificationItemProps,
    Exclude<
      keyof NotificationItemProps,
      'image' | 'disableTypography' | 'primary' | 'primaryTypographyProps' | 'secondary' | 'secondaryTypographyProps' | 'actions' | 'footer' | 'isNew'
    >
  > {
  /**
   * Notification obj
   * @default null
   */
  notificationObject: SCNotificationMentionType;
}

/**
 * This component render the content of the notification of type mention
 * @param inProps
 * @constructor
 */
export default function MentionNotification(inProps: MentionNotificationProps): JSX.Element {
  // PROPS
  const props: MentionNotificationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const objectType = getContributionType(notificationObject);
  const contribution = getContribution(notificationObject);

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root
      id={id}
      className={classNames(classes.root, className, `${PREFIX}-${template}`)}
      template={template}
      isNew={notificationObject.is_new}
      disableTypography
      image={
        <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[objectType].author)}>
          <Avatar
            alt={notificationObject[objectType].author.username}
            variant="circular"
            src={notificationObject[objectType].author.avatar}
            classes={{root: classes.avatar}}
          />
        </Link>
      }
      primary={
        <Typography component="div" color="inherit" className={classes.mentionText}>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject[objectType].author)} className={classes.username}>
            {notificationObject[objectType].author.username}
          </Link>{' '}
          {intl.formatMessage(messages.quotedYouOn, {
            b: (...chunks) => <strong>{chunks}</strong>
          })}{' '}
        </Typography>
      }
      secondary={
        <React.Fragment>
          <Link to={scRoutingContext.url(SCRoutes[`${objectType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[objectType]))}>
            <Typography component={'span'} variant="body2" className={classes.contributionText}>
              {getContributionSnippet(notificationObject[objectType])}
            </Typography>
          </Link>
          {(template === SCNotificationObjectTemplateType.DETAIL || template === SCNotificationObjectTemplateType.SNIPPET) && (
            <Box>
              <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
            </Box>
          )}
        </React.Fragment>
      }
      footer={
        template === SCNotificationObjectTemplateType.TOAST && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <DateTimeAgo date={notificationObject.active_at} />
            <Typography color="primary" component={'div'}>
              <Link to={scRoutingContext.url(SCRoutes[`${contribution.type.toUpperCase()}_ROUTE_NAME`], getRouteData(contribution))}>
                <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
              </Link>
            </Typography>
          </Stack>
        )
      }
      {...rest}
    />
  );
}
