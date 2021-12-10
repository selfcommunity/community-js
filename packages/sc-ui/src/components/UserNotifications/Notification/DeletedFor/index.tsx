import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeAgo from 'timeago-react';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {Link, SCNotificationDeletedForType, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {camelCase} from '../../../../../../sc-core/src/utils/string';
import { getContributeType } from '../../../../utils/contribute';

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
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  }
}));

export default function DeletedForNotification({
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
      <Box sx={{mb: 1, p: 1}}>
        <Typography variant={'body2'} color={'primary'} component={'span'}>
          <FormattedMessage id="ui.userNotifications.undeletedFor.youWrote" defaultMessage="ui.userNotifications.undeletedFor.youWrote" />
        </Typography>
        <Link to={scRoutingContext.url(contributionType, {id: notificationObject[contributionType].id})}>
          <Typography
            component={'span'}
            color={'primary'}
            variant="body2"
            gutterBottom
            dangerouslySetInnerHTML={{__html: notificationObject[contributionType].summary}}
          />
        </Link>
      </Box>
    </Root>
  );
}
