import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography} from '@mui/material';
import {Link, SCRoutingContextType, useSCRouting, SCNotificationIncubatorType, SCRoutes} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../../../shared/NewChip/NewChip';
import classNames from 'classnames';
import {grey, red} from '@mui/material/colors';
import {NotificationObjectTemplateType} from '../../../types';
import {getRouteData} from '../../../utils/contribute';

const messages = defineMessages({
  incubatorApproved: {
    id: 'ui.notification.incubatorApproved.approved',
    defaultMessage: 'ui.notification.incubatorApproved.approved'
  }
});

const PREFIX = 'SCIncubatorApprovedNotification';

const classes = {
  root: `${PREFIX}-root`,
  listItemSnippet: `${PREFIX}-list-item-snippet`,
  listItemSnippetNew: `${PREFIX}-list-item-snippet-new`,
  categoryIconWrap: `${PREFIX}-category-icon-wrap`,
  categoryIcon: `${PREFIX}-category-icon`,
  categoryIconSnippet: `${PREFIX}-category-icon-snippet`,
  categoryApprovedText: `${PREFIX}-category-approved-text`,
  activeAt: `${PREFIX}-active-at`,
  viewIncubatorWrap: `${PREFIX}-view-incubator-wrap`,
  viewIncubatorLink: `${PREFIX}-view-incubator-link`,
  toastInfo: `${PREFIX}-toast-info`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.listItemSnippet}`]: {
    padding: '0px 5px',
    alignItems: 'center'
  },
  [`& .${classes.listItemSnippetNew}`]: {
    borderLeft: '2px solid red'
  },
  [`& .${classes.categoryIconWrap}`]: {
    minWidth: 'auto',
    paddingRight: 10
  },
  [`& .${classes.categoryIcon}`]: {
    backgroundColor: red[500],
    color: '#FFF'
  },
  [`& .${classes.categoryIconSnippet}`]: {
    width: 30,
    height: 30
  },
  [`& .${classes.categoryApprovedText}`]: {
    display: 'inline',
    color: theme.palette.text.primary
  },
  [`& .${classes.viewIncubatorLink}`]: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing()
  },
  [`& .${classes.toastInfo}`]: {
    marginTop: 10
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
  template?: NotificationObjectTemplateType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function IncubatorApprovedNotification(props: NotificationIncubatorApprovedProps): JSX.Element {
  // PROPS
  const {
    notificationObject = null,
    id = `n_${props.notificationObject['feed_serialization_id']}`,
    template = NotificationObjectTemplateType.DETAIL,
    className,
    ...rest
  } = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // CONST
  const isSnippetTemplate = template === NotificationObjectTemplateType.SNIPPET;
  const isToastTemplate = template === NotificationObjectTemplateType.TOAST;

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className, `${PREFIX}-${template}`)} {...rest}>
      <ListItem
        alignItems={isSnippetTemplate ? 'center' : 'flex-start'}
        component={'div'}
        classes={{
          root: classNames({
            [classes.listItemSnippet]: isToastTemplate || isSnippetTemplate,
            [classes.listItemSnippetNew]: isSnippetTemplate && notificationObject.is_new
          })
        }}>
        <ListItemAvatar classes={{root: classes.categoryIconWrap}}>
          <Avatar
            alt={notificationObject.incubator.approved_category.name}
            src={notificationObject.incubator.approved_category.image_medium}
            variant="square"
            classes={{root: classNames(classes.categoryIcon, {[classes.categoryIconSnippet]: isSnippetTemplate})}}
          />
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <>
              {isSnippetTemplate ? (
                <Link to={scRoutingContext.url(SCRoutes.CATEGORY_ROUTE_NAME, notificationObject.incubator.approved_category)}>
                  <Typography component="span" className={classes.categoryApprovedText} color="inherit">
                    {intl.formatMessage(messages.incubatorApproved, {
                      name: notificationObject.incubator.name,
                      b: (...chunks) => <strong>{chunks}</strong>
                    })}
                  </Typography>
                </Link>
              ) : (
                <>
                  {template === NotificationObjectTemplateType.DETAIL && notificationObject.is_new && <NewChip />}
                  <Typography component="span" className={classes.categoryApprovedText} color="inherit">
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
            <>
              {template === NotificationObjectTemplateType.DETAIL && <DateTimeAgo date={notificationObject.active_at} className={classes.activeAt} />}
            </>
          }
        />
      </ListItem>
      {!isSnippetTemplate && (
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
      )}
      {template === NotificationObjectTemplateType.TOAST && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} className={classes.toastInfo}>
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
      )}
    </Root>
  );
}
