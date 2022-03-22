import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {grey, red} from '@mui/material/colors';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType, getContributionSnippet, getRouteData} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import {Link, SCRoutingContextType, useSCRouting, StringUtils, SCNotificationDeletedForType, SCRoutes} from '@selfcommunity/core';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';

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
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  flagIconWrap: `${PREFIX}-flag-icon-wrap`,
  flagIcon: `${PREFIX}-flag-icon`,
  flagIconSnippet: `${PREFIX}-flag-icon-snippet`,
  flagText: `${PREFIX}-flag-text`,
  activeAt: `${PREFIX}-active-at`,
  contributionWrap: `${PREFIX}-contribution-wrap`,
  contributionYouWroteLabel: `${PREFIX}-contribution-you-wrote-label`,
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
  [`& .${classes.flagIconWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.flagIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.flagIconSnippet}`]: {
    width: 30,
    height: 30
  },
  [`& .${classes.flagText}`]: {
    display: 'inline',
    color: theme.palette.text.primary
  },
  [`& .${classes.contributionWrap}`]: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  },
  [`& .${classes.toastInfo}`]: {
    marginTop: 10
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
 * @param props
 * @constructor
 */
export default function DeletedForNotification(props: NotificationDeletedForProps): JSX.Element {
  // PROPS
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
  const contributionType = getContributeType(notificationObject);
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;

  //INTL
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
        <ListItemAvatar classes={{root: classes.flagIconWrap}}>
          <Avatar variant="circular" classes={{root: classNames(classes.flagIcon, {[classes.flagIconSnippet]: isSnippetTemplate})}}>
            <Icon>outlined_flag</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {isSnippetTemplate ? (
                <Link
                  to={scRoutingContext.url(
                    SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                    getRouteData(notificationObject[contributionType])
                  )}>
                  <Typography component="span" color="inherit" className={classes.flagText}>
                    <FormattedMessage
                      id={`ui.notification.deletedFor.${StringUtils.camelCase(notificationObject.type)}Snippet`}
                      defaultMessage={`ui.notification.deletedFor.${StringUtils.camelCase(notificationObject.type)}Snippet`}
                    />
                  </Typography>
                </Link>
              ) : (
                <>
                  {template === SCNotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
                  <Typography component="span" color="inherit" className={classes.flagText}>
                    {intl.formatMessage(messages[StringUtils.camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})}
                  </Typography>
                </>
              )}
            </>
          }
          secondary={
            <>
              {template === SCNotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
            </>
          }
        />
      </ListItem>
      {!isSnippetTemplate && (
        <Box className={classes.contributionWrap}>
          <Typography variant={'body2'} color={'inherit'} classes={{root: classes.contributionYouWroteLabel}}>
            <FormattedMessage id="ui.notification.deletedFor.youWrote" defaultMessage="ui.notification.deletedFor.youWrote" />
          </Typography>
          <Link
            to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}
            className={classes.contributionText}>
            <Typography component={'span'} color={'inherit'} variant="body2" gutterBottom>
              {getContributionSnippet(notificationObject[contributionType])}
            </Typography>
          </Link>
        </Box>
      )}
      {template === SCNotificationObjectTemplateType.TOAST && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className={classes.toastInfo}>
          <DateTimeAgo date={notificationObject.active_at} />
          <Typography color="primary">
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
    </Root>
  );
}
