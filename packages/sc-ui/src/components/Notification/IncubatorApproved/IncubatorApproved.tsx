import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCRoutingContextType, useSCRouting, SCNotificationIncubatorType, SCRoutes} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';
import classNames from 'classnames';
import {red} from '@mui/material/colors';

const messages = defineMessages({
  incubatorApproved: {
    id: 'ui.notification.incubatorApproved.approved',
    defaultMessage: 'ui.notification.incubatorApproved.approved'
  }
});

const PREFIX = 'SCIncubatorApprovedNotification';

const classes = {
  root: `${PREFIX}-root`,
  categoryWrap: `${PREFIX}-category-wrap`,
  category: `${PREFIX}-category`,
  categoryApprovedText: `${PREFIX}-category-approved-text`,
  activeAt: `${PREFIX}-active-at`,
  viewIncubatorWrap: `${PREFIX}-view-incubator-wrap`,
  viewIncubatorLink: `${PREFIX}-view-incubator-link`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.category}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.categoryApprovedText}`]: {
    display: 'inline'
  }
}));

export interface NotificationIncubatorApprovedProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.feed_serialization_id>`
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
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar classes={{root: classes.categoryWrap}}>
          <Avatar
            alt={notificationObject.incubator.approved_category.name}
            src={notificationObject.incubator.approved_category.image_medium}
            variant="square"
            classes={{root: classes.category}}
          />
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {notificationObject.is_new && <NewChip />}
              <Typography component="span" className={classes.categoryApprovedText} color="inherit">
                {intl.formatMessage(messages.incubatorApproved, {
                  name: notificationObject.incubator.name,
                  b: (...chunks) => <strong>{chunks}</strong>
                })}
              </Typography>
            </>
          }
          secondary={<DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
        />
      </ListItem>
      <Box className={classes.viewIncubatorWrap}>
        <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, notificationObject.incubator.approved_category)}>
          <Typography component="div" className={classes.viewIncubatorLink}>
            <FormattedMessage
              id={'ui.notification.incubatorApproved.viewIncubator'}
              defaultMessage={'ui.notification.incubatorApproved.viewIncubator'}
            />
          </Typography>
        </Link>
      </Box>
    </Root>
  );
}
