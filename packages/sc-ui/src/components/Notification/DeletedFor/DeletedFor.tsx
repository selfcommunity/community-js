import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType, getRouteData} from '../../../utils/contribute';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';
import {Link, SCRoutingContextType, useSCRouting, StringUtils, SCNotificationDeletedForType, SCRoutes} from '@selfcommunity/core';

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

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NotificationDeletedForProps {
  /**
   * Id of the feedObject
   * @default 'n_<notificationObject.sid>'
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
 * This component render the content of the notification of type deleted for
 * @param props
 * @constructor
 */
export default function DeletedForNotification(props: NotificationDeletedForProps): JSX.Element {
  // PROPS
  const {notificationObject = null, id = `n_${props.notificationObject['feed_serialization_id']}`, className, ...rest} = props;

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
    <Root id={id} className={className} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Avatar variant="circular" sx={{backgroundColor: red[500]}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
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
        {notificationObject.is_new && <NewChip />}
        <Typography variant={'body2'} color={'primary'} component={'span'}>
          <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
        </Typography>
        <Link to={scRoutingContext.url(SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`], getRouteData(notificationObject[contributionType]))}>
          <Typography
            component={'span'}
            color={'primary'}
            variant="body2"
            gutterBottom
            sx={{textDecoration: 'underline'}}
            dangerouslySetInnerHTML={{__html: notificationObject[contributionType].summary}}
          />
        </Link>
      </Box>
    </Root>
  );
}
