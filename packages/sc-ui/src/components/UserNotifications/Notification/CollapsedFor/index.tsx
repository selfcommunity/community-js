import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {Link, SCNotificationDeletedForType, SCRoutingContextType, useSCRouting, StringUtils} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType} from '../../../../utils/contribute';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import NotificationNewChip from '../../NotificationNewChip';

const messages = defineMessages({
  collapsedForAdvertising: {
    id: 'ui.userNotifications.collapsedFor.collapsedForAdvertising',
    defaultMessage: 'ui.userNotifications.collapsedFor.collapsedForAdvertising'
  },
  collapsedForAggressive: {
    id: 'ui.userNotifications.collapsedFor.collapsedForAggressive',
    defaultMessage: 'ui.userNotifications.collapsedFor.collapsedForAggressive'
  },
  collapsedForVulgar: {
    id: 'ui.userNotifications.collapsedFor.collapsedForVulgar',
    defaultMessage: 'ui.userNotifications.collapsedFor.collapsedForVulgar'
  },
  collapsedForPoor: {
    id: 'ui.userNotifications.collapsedFor.collapsedForPoor',
    defaultMessage: 'ui.userNotifications.collapsedFor.collapsedForPoor'
  },
  collapsedForOfftopic: {
    id: 'ui.userNotifications.collapsedFor.collapsedForOfftopic',
    defaultMessage: 'ui.userNotifications.collapsedFor.collapsedForOfftopic'
  }
});

const PREFIX = 'SCCollapsedForNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NotificationCollapsedForProps {
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
 * This component render the content of the notification of type collapsed for
 * @param props
 * @constructor
 */
export default function CollapsedForNotification(props: NotificationCollapsedForProps): JSX.Element {
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
              {notificationObject.is_new && <NotificationNewChip />}
              <b>
                {intl.formatMessage(messages[StringUtils.camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})} (
                <FormattedMessage id="ui.userNotifications.viewRules" defaultMessage="ui.userNotifications.viewRules" />
                ).
              </b>
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
      <Box sx={{mb: 1}}>
        <Typography variant={'body2'} color={'primary'} sx={{p: 1}}>
          <FormattedMessage id="ui.userNotifications.undeletedFor.youWrote" defaultMessage="ui.userNotifications.undeletedFor.youWrote" />
        </Typography>
        <Link to={scRoutingContext.url(contributionType, {id: notificationObject[contributionType].id})}>
          <Typography
            component={'span'}
            variant="body2"
            sx={{textDecoration: 'underline'}}
            gutterBottom
            dangerouslySetInnerHTML={{__html: notificationObject[contributionType].summary}}
          />
        </Link>
      </Box>
    </Root>
  );
}
