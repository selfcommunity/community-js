import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCRoutingContextType, useSCRouting, SCNotificationIncubatorType, SCRoutes} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../shared/DateTimeAgo';
import NotificationNewChip from '../../NotificationNewChip';

const messages = defineMessages({
  incubatorApproved: {
    id: 'ui.userNotifications.incubatorApproved.approved',
    defaultMessage: 'ui.userNotifications.incubatorApproved.approved'
  }
});

const PREFIX = 'SCIncubatorApprovedNotification';

const classes = {
  categoryImage: `${PREFIX}-category-image`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface NotificationIncubatorApprovedProps {
  /**
   * Id of the feedObject
   * @default 'n_<notificationObject.feed_serialization_id>'
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
  notificationObject: SCNotificationIncubatorType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function IncubatorApprovedNotification(props: NotificationIncubatorApprovedProps): JSX.Element {
  // PROPS
  const {notificationObject = null, id = `n_${props.notificationObject['feed_serialization_id']}`, className, ...rest} = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={className} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Avatar
            alt={notificationObject.incubator.approved_category.name}
            src={notificationObject.incubator.approved_category.image_medium}
            variant="square"
            className={classes.categoryImage}
          />
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              {notificationObject.is_new && <NotificationNewChip />}
              <b>
                {intl.formatMessage(messages.incubatorApproved, {
                  name: notificationObject.incubator.name,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </b>
              <br />
            </Typography>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} />}
        />
      </ListItem>
      <Box sx={{mb: 1, p: '5px 15px'}}>
        <Typography component="div">
          <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, notificationObject.incubator.approved_category)}>
            <FormattedMessage
              id={'ui.userNotifications.incubatorApproved.viewIncubator'}
              defaultMessage={'ui.userNotifications.incubatorApproved.viewIncubator'}
            />
          </Link>
        </Typography>
      </Box>
    </Root>
  );
}
