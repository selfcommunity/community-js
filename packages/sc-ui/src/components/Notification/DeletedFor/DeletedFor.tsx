import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Stack, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributionType, getContributionSnippet, getRouteData} from '../../../utils/contribution';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import {Link, SCRoutingContextType, useSCRouting, StringUtils, SCNotificationDeletedForType, SCRoutes} from '@selfcommunity/core';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import useThemeProps from '@mui/material/styles/useThemeProps';
import NotificationItem from '../../../shared/NotificationItem';
import {red} from '@mui/material/colors';

const messages = defineMessages({
  deletedForAdvertising: {
    id: 'ui.notification.deletedFor.deletedForAdvertising',
    defaultMessage: 'ui.notification.deletedFor.deletedForAdvertising'
  },
  deletedForAggressive: {
    id: 'ui.notification.deletedFor.deletedForAggressive',
    defaultMessage: 'ui.notification.deletedFor.deletedForAggressive'
  },
  deletedForVulgar: {
    id: 'ui.notification.deletedFor.deletedForVulgar',
    defaultMessage: 'ui.notification.deletedFor.deletedForVulgar'
  },
  deletedForPoor: {
    id: 'ui.notification.deletedFor.deletedForPoor',
    defaultMessage: 'ui.notification.deletedFor.deletedForPoor'
  },
  deletedForOfftopic: {
    id: 'ui.notification.deletedFor.deletedForOfftopic',
    defaultMessage: 'ui.notification.deletedFor.deletedForOfftopic'
  }
});

const PREFIX = 'SCDeletedForNotification';

const classes = {
  root: `${PREFIX}-root`,
  flagIcon: `${PREFIX}-flag-icon`,
  flagText: `${PREFIX}-flag-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionYouWroteLabel: `${PREFIX}-contribution-you-wrote-label`,
  contributionText: `${PREFIX}-contribution-text`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.flagIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.flagText}`]: {
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionWrap}`]: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    textOverflow: 'ellipsis',
    display: 'inline',
    overflow: 'hidden'
  },
  [`& .${classes.contributionText}`]: {
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}));

export interface NotificationDeletedForProps {
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
  notificationObject: SCNotificationDeletedForType;

  /**
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type deleted for
 * @param inProps
 * @constructor
 */
export default function DeletedForNotification(inProps: NotificationDeletedForProps): JSX.Element {
  // PROPS
  const props: NotificationDeletedForProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject = null,
    id = `n_${props.notificationObject['feed_serialization_id']}`,
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
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <NotificationItem
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
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}>
                <Typography component="div" color="inherit" className={classes.flagText}>
                  <FormattedMessage
                    id={`ui.notification.deletedFor.${StringUtils.camelCase(notificationObject.type)}Snippet`}
                    defaultMessage={`ui.notification.deletedFor.${StringUtils.camelCase(notificationObject.type)}Snippet`}
                  />
                </Typography>
              </Link>
            ) : (
              <>
                {template === SCNotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
                <Typography component="div" color="inherit" className={classes.flagText}>
                  {intl.formatMessage(messages[StringUtils.camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})}
                </Typography>
              </>
            )}
          </>
        }
        secondary={
          template === SCNotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
        }
        footer={
          <>
            {!isSnippetTemplate && (
              <Box className={classes.contributionWrap}>
                <Typography variant={'body2'} color={'inherit'} classes={{root: classes.contributionYouWroteLabel}}>
                  <FormattedMessage id="ui.notification.deletedFor.youWrote" defaultMessage="ui.notification.deletedFor.youWrote" />
                </Typography>
                <Link
                  to={scRoutingContext.url(
                    SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                    getRouteData(notificationObject[contributionType])
                  )}
                  className={classes.contributionText}>
                  <Typography component={'span'} color={'inherit'} variant="body2" gutterBottom>
                    {getContributionSnippet(notificationObject[contributionType])}
                  </Typography>
                </Link>
              </Box>
            )}
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
        }
      />
    </Root>
  );
}
