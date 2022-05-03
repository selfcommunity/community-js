import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Button, Stack, Typography} from '@mui/material';
import {Link, SCRoutingContextType, useSCRouting, SCNotificationIncubatorType, SCRoutes} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {SCNotificationObjectTemplateType} from '../../../types';
import useThemeProps from '@mui/material/styles/useThemeProps';
import NotificationItem from '../../../shared/NotificationItem';

const messages = defineMessages({
  incubatorApproved: {
    id: 'ui.notification.incubatorApproved.approved',
    defaultMessage: 'ui.notification.incubatorApproved.approved'
  }
});

const PREFIX = 'SCIncubatorApprovedNotification';

const classes = {
  root: `${PREFIX}-root`,
  categoryIcon: `${PREFIX}-category-icon`,
  categoryApprovedText: `${PREFIX}-category-approved-text`,
  activeAt: `${PREFIX}-active-at`,
  viewIncubatorButton: `${PREFIX}-view-incubator-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.categoryIcon}`]: {
    borderRadius: 3
  },
  [`& .${classes.viewIncubatorButton}`]: {
    padding: theme.spacing(),
    paddingBottom: 0,
    textTransform: 'initial',
    marginLeft: -8
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
   * Notification Object template type
   * @default 'detail'
   */
  template?: SCNotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function IncubatorApprovedNotification(inProps: NotificationIncubatorApprovedProps): JSX.Element {
  // PROPS
  const props: NotificationIncubatorApprovedProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    notificationObject = null,
    id = `n_${props.notificationObject['feed_serialization_id']}`,
    template = SCNotificationObjectTemplateType.DETAIL,
    className,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === SCNotificationObjectTemplateType.SNIPPET;

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <NotificationItem
        template={template}
        isNew={notificationObject.is_new}
        disableTypography
        image={
          <Avatar
            alt={notificationObject.incubator.approved_category.name}
            src={notificationObject.incubator.approved_category.image_medium}
            variant="square"
            classes={{root: classes.categoryIcon}}
          />
        }
        primary={
          <>
            {isSnippetTemplate ? (
              <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, notificationObject.incubator.approved_category)}>
                <Typography component="div" className={classes.categoryApprovedText} color="inherit">
                  {intl.formatMessage(messages.incubatorApproved, {
                    name: notificationObject.incubator.name,
                    b: (...chunks) => <strong>{chunks}</strong>
                  })}
                </Typography>
              </Link>
            ) : (
              <>
                {template === SCNotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
                <Typography component="div" className={classes.categoryApprovedText} color="inherit">
                  {intl.formatMessage(messages.incubatorApproved, {
                    name: notificationObject.incubator.name,
                    b: (...chunks) => <strong>{chunks}</strong>
                  })}
                </Typography>
              </>
            )}
          </>
        }
        secondary={
          template === SCNotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />
        }
        footer={
          <>
            {template === SCNotificationObjectTemplateType.DETAIL && (
              <Button
                component={Link}
                to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, notificationObject.incubator.approved_category)}
                className={classes.viewIncubatorButton}>
                <FormattedMessage
                  id={'ui.notification.incubatorApproved.viewIncubator'}
                  defaultMessage={'ui.notification.incubatorApproved.viewIncubator'}
                />
              </Button>
            )}
            {template === SCNotificationObjectTemplateType.TOAST && (
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <DateTimeAgo date={notificationObject.active_at} />
                <Typography color="primary" component={'div'}>
                  <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, notificationObject.incubator)}>
                    <FormattedMessage
                      id="ui.userToastNotifications.incubatorApproved.viewIncubator"
                      defaultMessage={'ui.userToastNotifications.incubatorApproved.viewIncubator'}
                    />
                  </Link>
                </Typography>
              </Stack>
            )}
          </>
        }
      />
    </Root>
  );
}
