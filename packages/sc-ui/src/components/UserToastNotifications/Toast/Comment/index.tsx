import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography} from '@mui/material';
import {Link, SCNotificationCommentType, SCNotificationTypologyType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {grey} from '@mui/material/colors';
import DateTimeAgo from '../../../../shared/DateTimeAgo';

const messages = defineMessages({
  comment: {
    id: 'ui.userNotifications.comment.comment',
    defaultMessage: 'ui.userNotifications.comment.comment'
  },
  nestedComment: {
    id: 'ui.userNotifications.comment.nestedComment',
    defaultMessage: 'ui.userNotifications.comment.nestedComment'
  }
});

const PREFIX = 'SCUserNotificationCommentToast';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  '& .MuiSvgIcon-root': {
    width: '0.7em',
    marginBottom: '0.5px'
  },
  '& a': {
    textDecoration: 'none',
    color: grey[900]
  }
}));
export interface UserNotificationCommentToastProps {
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
export default function UserNotificationCommentToast(props: UserNotificationCommentToastProps): JSX.Element {
  // PROPS
  const {notificationObject = null, ...rest} = props;

  // ROUTING
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  //INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return <div dangerouslySetInnerHTML={{__html: notificationObject.html}} />;
  /* return (
    <Root {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.comment.author.id})}>
            <Avatar alt={notificationObject.comment.author.username} variant="circular" src={notificationObject.comment.author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, {id: notificationObject.comment.author.id})}>
                {notificationObject.comment.author.username}
              </Link>{' '}
              {notificationObject.type === SCNotificationTypologyType.NESTED_COMMENT
                ? intl.formatMessage(messages.comment, {
                    b: (...chunks) => <strong>{chunks}</strong>
                  })
                : intl.formatMessage(messages.nestedComment, {
                    b: (...chunks) => <strong>{chunks}</strong>
                  })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Link to={scRoutingContext.url('comment', {id: notificationObject.comment.id})} sx={{textDecoration: 'underline'}}>
                <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.comment.summary}} />
              </Link>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <DateTimeAgo date={notificationObject.active_at} />
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  ); */
}
