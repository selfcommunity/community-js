import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {Link, SCNotificationDeletedForType, SCRoutingContextType, useSCRouting, StringUtils} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType} from '../../../../utils/contribute';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {NotificationDeletedForProps} from '../CollapsedFor';
import NotificationNewChip from '../../NotificationNewChip';

const messages = defineMessages({
  deletedForAdvertising: {
    id: 'ui.userNotifications.deletedFor.deletedForAdvertising',
    defaultMessage: 'ui.userNotifications.deletedFor.deletedForAdvertising'
  },
  deletedForAggressive: {
    id: 'ui.userNotifications.deletedFor.deletedForAggressive',
    defaultMessage: 'ui.userNotifications.deletedFor.deletedForAggressive'
  },
  deletedForVulgar: {
    id: 'ui.userNotifications.deletedFor.deletedForVulgar',
    defaultMessage: 'ui.userNotifications.deletedFor.deletedForVulgar'
  },
  deletedForPoor: {
    id: 'ui.userNotifications.deletedFor.deletedForPoor',
    defaultMessage: 'ui.userNotifications.deletedFor.deletedForPoor'
  },
  deletedForOfftopic: {
    id: 'ui.userNotifications.deletedFor.deletedForOfftopic',
    defaultMessage: 'ui.userNotifications.deletedFor.deletedForOfftopic'
  }
});

const PREFIX = 'SCDeletedForNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function DeletedForNotification(props: NotificationDeletedForProps): JSX.Element {
  // PROPS
  const {notificationObject = null, ...rest} = props;

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
    <Root {...rest}>
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
                <FormattedMessage id="ui.userNotifications.viewRules" defaultMessage="ui.userNotifications.viewRules" />
                ).
              </b>
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
      <Box sx={{mb: 1, p: 1}}>
        {notificationObject.is_new && <NotificationNewChip />}
        <Typography variant={'body2'} color={'primary'} component={'span'}>
          <FormattedMessage id="ui.userNotifications.undeletedFor.youWrote" defaultMessage="ui.userNotifications.undeletedFor.youWrote" />
        </Typography>
        <Link to={scRoutingContext.url(contributionType, {id: notificationObject[contributionType].id})}>
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
