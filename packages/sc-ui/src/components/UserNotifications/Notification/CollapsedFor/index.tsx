import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {SCNotificationDeletedForType} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {camelCase} from '../../../../../../sc-core/src/utils/string';

const messages = defineMessages({
  kindlyNoticeForAdvertising: {
    id: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForAdvertising',
    defaultMessage: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForAdvertising'
  },
  kindlyNoticeForAggressive: {
    id: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForAggressive',
    defaultMessage: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForAggressive'
  },
  kindlyNoticeForVulgar: {
    id: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForVulgar',
    defaultMessage: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForVulgar'
  },
  kindlyNoticeForPoor: {
    id: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForPoor',
    defaultMessage: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForPoor'
  },
  kindlyNoticeForOfftopic: {
    id: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForOfftopic',
    defaultMessage: 'ui.userNotifications.kindlyNoticeFor.kindlyNoticeForOfftopic'
  }
});

const PREFIX = 'SCCollapsedForNotification';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export default function CollapsedForNotification({
  notificationObject = null,
  ...props
}: {
  notificationObject: SCNotificationDeletedForType;
}): JSX.Element {
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
          secondary={
            <React.Fragment>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <AccessTimeIcon sx={{paddingRight: '2px'}} />
                  <TimeAgo datetime={notificationObject.active_at} />
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
      <Box sx={{mb: 1}}>
        <Typography variant={'body2'} color={'primary'} sx={{p: 1}}>
          <FormattedMessage id="ui.userNotifications.undeletedFor.youWrote" defaultMessage="ui.userNotifications.undeletedFor.youWrote" />
        </Typography>
        <Typography component={'span'} variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.post.summary}} />
      </Box>
    </Root>
  );
}
