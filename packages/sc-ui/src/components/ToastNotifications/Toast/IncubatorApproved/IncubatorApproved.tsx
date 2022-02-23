import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {getContributeType} from '../../../../utils/contribute';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import {Link, SCRoutingContextType, useSCRouting, SCRoutes} from '@selfcommunity/core';
import classNames from 'classnames';

const messages = defineMessages({
  incubatorApproved: {
    id: 'ui.userToastNotifications.incubatorApproved.approved',
    defaultMessage: 'ui.userToastNotifications.incubatorApproved.approved'
  }
});

const PREFIX = 'SCIncubatorApprovedNotificationToast';

const classes = {
  root: `${PREFIX}-root`,
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

export interface NotificationIncubatorApprovedToastProps {
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
 * This component render the content of the
 * toast notification of type incubator approved
 * @param props
 * @constructor
 */
export default function IncubatorApprovedNotificationToast(props: NotificationIncubatorApprovedToastProps): JSX.Element {
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
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem component={'div'} className={classes.content}>
        <ListItemAvatar>
          <Avatar alt={notificationObject.incubator.name} src={notificationObject.incubator.image_medium} variant="square" />
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <b>
                {intl.formatMessage(messages.incubatorApproved, {
                  name: notificationObject.incubator.name,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </b>
            </Typography>
          }
        />
      </ListItem>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <DateTimeAgo date={notificationObject.active_at} />
        <Typography color="primary">
          <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, notificationObject.incubator)}>
            <FormattedMessage
              id="ui.userToastNotifications.incubatorApproved.viewIncubator"
              defaultMessage={'ui.userToastNotifications.incubatorApproved.viewIncubator'}
            />
          </Link>
        </Typography>
      </Stack>
    </Root>
  );
}
