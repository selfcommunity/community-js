import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {Link, SCNotificationDeletedForType, SCRoutingContextType, useSCRouting, StringUtils, SCRoutes} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType, getContributionSnippet, getRouteData} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';
import classNames from 'classnames';

const messages = defineMessages({
  kindlyNoticeAdvertising: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeForAdvertising',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeForAdvertising'
  },
  kindlyNoticeAggressive: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeForAggressive',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeForAggressive'
  },
  kindlyNoticeVulgar: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeForVulgar',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeForVulgar'
  },
  kindlyNoticePoor: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeForPoor',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeForPoor'
  },
  kindlyNoticeOfftopic: {
    id: 'ui.notification.kindlyNoticeFor.kindlyNoticeForOfftopic',
    defaultMessage: 'ui.notification.kindlyNoticeFor.kindlyNoticeForOfftopic'
  }
});

const PREFIX = 'SCKindlyNoticeForNotification';

const classes = {
  root: `${PREFIX}-root`,
  flagIconWrap: `${PREFIX}-flag-icon-wrap`,
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
    display: 'inline',
    fontWeight: '600'
  },
  [`& .${classes.contributionWrap}`]: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2)
  },
  [`& .${classes.contributionText}`]: {
    textDecoration: 'underline'
  }
}));

export interface NotificationKindlyNoticeForProps {
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
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type kindly notice for
 * @param props
 * @constructor
 */
export default function KindlyNoticeForNotification(props: NotificationKindlyNoticeForProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const contributionType = getContributeType(notificationObject);

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar classes={{root: classes.flagIconWrap}}>
          <Avatar variant="circular" classes={{root: classes.flagIcon}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}
              <Typography component="span" color="inherit" className={classes.flagText}>
                {intl.formatMessage(messages[StringUtils.camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})}
              </Typography>
            </>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
        />
      </ListItem>
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
    </Root>
  );
}
