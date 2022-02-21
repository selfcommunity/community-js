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
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
        <ListItemAvatar>
          <Avatar variant="circular" sx={{backgroundColor: red[500]}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="inherit">
              {notificationObject.is_new && <NewChip />}
              <b>
                {intl.formatMessage(messages[StringUtils.camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})} (
                <FormattedMessage id="ui.notification.viewRules" defaultMessage="ui.notification.viewRules" />
                ).
              </b>
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
      <Box sx={{mb: 1, p: 1}}>
        <Typography variant={'body2'} color={'inherit'}>
          <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
        </Typography>
        <Link to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}>
          <Typography component={'span'} variant="body2" sx={{textDecoration: 'underline'}} gutterBottom>
            {getContributionSnippet(notificationObject[contributionType])}
          </Typography>
        </Link>
      </Box>
    </Root>
  );
}
