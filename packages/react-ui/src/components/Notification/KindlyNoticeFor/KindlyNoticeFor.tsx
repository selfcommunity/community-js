import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {camelCase} from '@selfcommunity/utils';
import {Link, SCRoutingContextType, useSCRouting, SCRoutes} from '@selfcommunity/react-core';
import {SCNotificationDeletedForType} from '@selfcommunity/types';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributionType, getContributionSnippet, getRouteData} from '../../../utils/contribution';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {PREFIX} from '../constants';

const messages = defineMessages({
  youWrote: {
    id: 'ui.notification.kindlyNoticeFor.youWrote',
    defaultMessage: 'ui.notification.kindlyNoticeFor.youWrote'
  },
  kindlyNoticeAdvertising: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeAdvertising',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeAdvertising'
  },
  kindlyNoticeAggressive: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeAggressive',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeAggressive'
  },
  kindlyNoticeVulgar: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeVulgar',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeVulgar'
  },
  kindlyNoticePoor: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticePoor',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticePoor'
  },
  kindlyNoticeOfftopic: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeOfftopic',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeOfftopic'
  }
});

const classes = {
  root: `${PREFIX}-kindly-notice-for-root`,
  flagIcon: `${PREFIX}-flag-icon`,
  flagText: `${PREFIX}-flag-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionYouWroteLabel: `${PREFIX}-contribution-you-wrote-label`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'KindlyNoticeForRoot'
})(() => ({}));

export interface NotificationKindlyNoticeForProps
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
  notificationObject: SCNotificationDeletedForType;
}

/**
 * This component render the content of the notification of type kindly notice for
 * @constructor
 * @param props
 */
export default function KindlyNoticeForNotification(props: NotificationKindlyNoticeForProps): JSX.Element {
  // PROPS
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    className,
    template = SCNotificationObjectTemplateType.DETAIL,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const contributionType = getContributionType(notificationObject);

  //INTL
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
        <Avatar variant="circular" classes={{root: classes.flagIcon}}>
          <Icon>outlined_flag</Icon>
        </Avatar>
      }
      primary={
        <>
          {isSnippetTemplate ? (
            <Link
              to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}>
              <Typography component="div" color="inherit" className={classes.flagText}>
                <FormattedMessage
                  id={`ui.notification.kindlyNoticeFor.${camelCase(notificationObject.type)}Snippet`}
                  defaultMessage={`ui.notification.kindlyNoticeFor.${camelCase(notificationObject.type)}Snippet`}
                />
              </Typography>
            </Link>
          ) : (
            <Typography component="div" color="inherit" className={classes.flagText}>
              {intl.formatMessage(messages[camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})}
            </Typography>
          )}
        </>
      }
      secondary={
        (template === SCNotificationObjectTemplateType.DETAIL || template === SCNotificationObjectTemplateType.SNIPPET) && (
          <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
        )
      }
      footer={
        isSnippetTemplate ? null : (
          <>
            <Box className={classes.contributionWrap}>
              <Typography variant={'body2'} color={'inherit'} component={'div'} classes={{root: classes.contributionYouWroteLabel}}>
                {intl.formatMessage(messages.youWrote, {
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </Typography>
              <Link
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}
                className={classes.contributionText}>
                <Typography component={'span'} variant="body2">
                  {getContributionSnippet(notificationObject[contributionType])}
                </Typography>
              </Link>
            </Box>
            {template === SCNotificationObjectTemplateType.TOAST && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <DateTimeAgo date={notificationObject.active_at} />
                <Typography color="primary" component={'div'}>
                  <Link
                    to={scRoutingContext.url(
                      SCRoutes[`${notificationObject[contributionType]['type'].toUpperCase()}_ROUTE_NAME`],
                      getRouteData(notificationObject[contributionType])
                    )}>
                    <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
                  </Link>
                </Typography>
              </Stack>
            )}
          </>
        )
      }
      {...rest}
    />
  );
}
