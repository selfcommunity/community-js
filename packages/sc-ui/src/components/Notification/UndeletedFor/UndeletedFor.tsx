import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import { grey, red } from '@mui/material/colors';
import {Link, SCNotificationUnDeletedForType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import {getContributeType, getContributionSnippet, getRouteData} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';

const PREFIX = 'SCUndeletedForNotification';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  undeletedIconWrap: `${PREFIX}-undeleted-icon-wrap`,
  undeletedIcon: `${PREFIX}-undeleted-icon`,
  undeletedIconSnippet: `${PREFIX}-ndeleted-icon-snippet`,
  undeletedText: `${PREFIX}-undeleted-text`,
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
    alignItems: 'center',
    borderLeft: `2px solid ${grey[300]}`
  },
  [`& .${classes.listItemSnippetNew}`]: {
    borderLeft: `2px solid ${red[500]}`
  },
  [`& .${classes.undeletedIconWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.undeletedIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.undeletedIconSnippet}`]: {
    width: 30,
    height: 30
  },
  [`& .${classes.undeletedText}`]: {
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

export interface NotificationUndeletedProps {
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
  notificationObject: SCNotificationUnDeletedForType;

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
 * This component render the content of the notification of type undeleted for
 * @param props
 * @constructor
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
  const isToastTemplate = template === SCNotificationObjectTemplateType.TOAST;
  const contributionType = getContributeType(notificationObject);

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
        <ListItemAvatar classes={{root: classes.undeletedIconWrap}}>
          <Avatar variant="circular" classes={{root: classNames(classes.undeletedIcon, {[classes.undeletedIconSnippet]: isSnippetTemplate})}}>
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
                  <Typography component="span" color="inherit" className={classes.undeletedText}>
                    <FormattedMessage
                      id="ui.notification.undeletedFor.restoredContentSnippet"
                      defaultMessage="ui.notification.undeletedFor.restoredContentSnippet"
                    />
                  </Typography>
                </Link>
              ) : (
                <>
                  {template === SCNotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
                  <Typography component="span" color="inherit" className={classes.undeletedText}>
                    <FormattedMessage
                      id="ui.notification.undeletedFor.restoredContent"
                      defaultMessage="ui.notification.undeletedFor.restoredContent"
                    />
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
          <Typography variant={'body2'} color={'inherit'} component={'span'} classes={{root: classes.contributionYouWroteLabel}}>
            <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
          </Typography>
          <Link
            to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}
            className={classes.contributionText}>
            <Typography component={'span'} variant="body2" gutterBottom>
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
