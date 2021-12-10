import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {Link, SCNotificationDeletedForType, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {camelCase} from '../../../../../../sc-core/src/utils/string';
import {getContributeType} from '../../../../utils/contribute';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

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

const PREFIX = 'SCKindlyNoticeForNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function KindlyNoticeForNotification({
  notificationObject = null,
  ...props
}: {
  notificationObject: SCNotificationDeletedForType;
}): JSX.Element {
  const scRoutingContext: SCRoutingContextType = useSCRouting();
  const contributionType = getContributeType(notificationObject);
  const intl = useIntl();
  return (
    <Root {...props}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar variant="circular" sx={{backgroundColor: red[500]}}>
            <EmojiFlagsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <b>
                {intl.formatMessage(messages[camelCase(notificationObject.type)], {b: (...chunks) => <strong>{chunks}</strong>})} (
                <FormattedMessage id="ui.userNotifications.viewRules" defaultMessage="ui.userNotifications.viewRules" />
                ).
              </b>
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
      <Box sx={{mb: 1, p: 1}}>
        <Typography variant={'body2'} color={'primary'}>
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
