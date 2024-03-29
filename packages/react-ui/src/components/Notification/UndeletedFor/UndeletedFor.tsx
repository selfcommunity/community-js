import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {SCNotificationUnDeletedForType} from '@selfcommunity/types';
import {FormattedMessage} from 'react-intl';
import {getContributionSnippet, getContributionType, getRouteData} from '../../../utils/contribution';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {PREFIX} from '../constants';

const classes = {
  root: `${PREFIX}-undeleted-for-root`,
  undeletedIcon: `${PREFIX}-undeleted-icon`,
  undeletedText: `${PREFIX}-undeleted-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionYouWroteLabel: `${PREFIX}-contribution-you-wrote-label`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'UndeletedForRoot'
})(() => ({}));

export interface NotificationUndeletedProps
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
  notificationObject: SCNotificationUnDeletedForType;
}

/**
 * This component render the content of the notification of type undeleted for
 * @constructor
 * @param props
 */
export default function UndeletedForNotification(props: NotificationUndeletedProps): JSX.Element {
  // PROPS
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
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const contributionType = getContributionType(notificationObject);

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
        <Avatar variant="circular" classes={{root: classes.undeletedIcon}}>
          <Icon>outlined_flag</Icon>
        </Avatar>
      }
      primary={
        <>
          {isSnippetTemplate ? (
            <Link
              to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}>
              <Typography component="div" color="inherit" className={classes.undeletedText}>
                <FormattedMessage
                  id="ui.notification.undeletedFor.restoredContentSnippet"
                  defaultMessage="ui.notification.undeletedFor.restoredContentSnippet"
                />
              </Typography>
            </Link>
          ) : (
            <Typography component="div" color="inherit" className={classes.undeletedText}>
              <FormattedMessage id="ui.notification.undeletedFor.restoredContent" defaultMessage="ui.notification.undeletedFor.restoredContent" />
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
                <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
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
