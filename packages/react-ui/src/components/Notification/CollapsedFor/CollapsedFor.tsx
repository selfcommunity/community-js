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
import {useThemeProps} from '@mui/system';
import NotificationItem, {NotificationItemProps} from '../../../shared/NotificationItem';
import {PREFIX} from '../constants';

const messages = defineMessages({
  collapsedForAdvertising: {
    id: 'ui.notification.collapsedFor.collapsedForAdvertising',
    defaultMessage: 'ui.notification.collapsedFor.collapsedForAdvertising'
  },
  collapsedForAggressive: {
    id: 'ui.notification.collapsedFor.collapsedForAggressive',
    defaultMessage: 'ui.notification.collapsedFor.collapsedForAggressive'
  },
  collapsedForVulgar: {
    id: 'ui.notification.collapsedFor.collapsedForVulgar',
    defaultMessage: 'ui.notification.collapsedFor.collapsedForVulgar'
  },
  collapsedForPoor: {
    id: 'ui.notification.collapsedFor.collapsedForPoor',
    defaultMessage: 'ui.notification.collapsedFor.collapsedForPoor'
  },
  collapsedForOfftopic: {
    id: 'ui.notification.collapsedFor.collapsedForOfftopic',
    defaultMessage: 'ui.notification.collapsedFor.collapsedForOfftopic'
  }
});

const classes = {
  root: `${PREFIX}-collapsed-for-root`,
  flagIcon: `${PREFIX}-flag-icon`,
  flagText: `${PREFIX}-flag-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionYouWroteLabel: `${PREFIX}-contribution-you-wrote-label`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(NotificationItem, {
  name: PREFIX,
  slot: 'CollapsedForRoot'
})(() => ({}));

export interface NotificationCollapsedForProps
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
 * This component render the content of the notification of type collapsed for
 * @param inProps
 * @constructor
 */
export default function CollapsedForNotification(inProps: NotificationCollapsedForProps): JSX.Element {
  // PROPS
  const props: NotificationCollapsedForProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject,
    id = `n_${props.notificationObject['sid']}`,
    template = SCNotificationObjectTemplateType.DETAIL,
    className,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const contributionType = getContributionType(notificationObject);
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;

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
                  id={`ui.notification.collapsedFor.${camelCase(notificationObject.type)}Snippet`}
                  defaultMessage={`ui.notification.collapsedFor.${camelCase(notificationObject.type)}Snippet`}
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
                <FormattedMessage id="ui.notification.collapsedFor.youWrote" defaultMessage="ui.notification.collapsedFor.youWrote" />
              </Typography>
              <Link
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}
                className={classes.contributionText}>
                <Typography component={'span'} variant="body2" gutterBottom>
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
