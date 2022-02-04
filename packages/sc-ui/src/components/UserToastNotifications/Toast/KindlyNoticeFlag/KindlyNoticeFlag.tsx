import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import {red} from '@mui/material/colors';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType, getRouteData} from '../../../../utils/contribute';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {Link, SCRoutingContextType, useSCRouting, StringUtils, SCRoutes} from '@selfcommunity/core';

const messages = defineMessages({
  kindlyNoticeFlag: {
    id: 'ui.notification.kindlyNoticeFlag.kindlyNoticeFlag',
    defaultMessage: 'ui.notification.kindlyNoticeFlag.kindlyNoticeFlag'
  }
});

const PREFIX = 'SCKindlyNoticeFlagNotificationToast';

const classes = {
  content: `${PREFIX}-content`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${PREFIX}-content`]: {
    padding: '8px 0px 15px 0px'
  }
}));

export interface NotificationKindlyNoticeFlagToastProps {
  /**
   * Id of the feedObject
   * @default 'tn_<notificationObject.feed_serialization_id>'
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
  notificationObject: any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * !IMPORTANT: this component is not used yet because the notification via ws is not launched
 * This component render the content of the
 * toast notification of type kindly notice flag (contribution)
 * @param props
 * @constructor
 */
export default function KindlyNoticeFlagNotificationToast(props: NotificationKindlyNoticeFlagToastProps): JSX.Element {
  // PROPS
  const {notificationObject = null, id = `tn_${props.notificationObject['feed_serialization_id']}`, className, ...rest} = props;

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
      <ListItem component={'div'} className={classes.content}>
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
        />
      </ListItem>
      <Box sx={{mb: 1, p: 1}}>
        <Typography variant={'body2'} color={'primary'}>
          <FormattedMessage id="ui.notification.undeletedFor.youWrote" defaultMessage="ui.notification.undeletedFor.youWrote" />
        </Typography>
        <Link to={scRoutingContext.url(contributionType, {id: notificationObject[contributionType].id})}>
          <Typography
            component={'span'}
            sx={{textDecoration: 'underline'}}
            variant="body2"
            gutterBottom
            dangerouslySetInnerHTML={{__html: notificationObject[contributionType].summary}}
          />
        </Link>
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <DateTimeAgo date={notificationObject.active_at} />
        <Typography color="primary">
          <Link
            to={scRoutingContext.url(
              SCRoutes[`${notificationObject[contributionType].type.toUpperCase()}_ROUTE_NAME`],
              getRouteData(notificationObject[contributionType])
            )}>
            <FormattedMessage id="ui.userToastNotifications.viewContribution" defaultMessage={'ui.userToastNotifications.viewContribution'} />
          </Link>
        </Typography>
      </Stack>
    </Root>
  );
}
