import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {Link, SCCommentTypologyType, SCNotificationVoteUpType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, useIntl} from 'react-intl';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';
import {getRouteData, getContributeType} from '../../../utils/contribute';
import {grey} from '@mui/material/colors';
import classNames from 'classnames';

const messages = defineMessages({
  appreciated: {
    id: 'ui.notification.voteUp.appreciated',
    defaultMessage: 'ui.notification.voteUp.appreciated'
  }
});

const PREFIX = 'SCVoteUpNotification';

const classes = {
  root: `${PREFIX}-root`
};

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

export interface NotificationVoteUpProps {
  /**
   * Id of the feedObject
   * @default `n_<notificationObject.sid>`
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
  notificationObject: SCNotificationVoteUpType;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type vote up
 * @param props
 * @constructor
 */
export default function VoteUpNotification(props: NotificationVoteUpProps): JSX.Element {
  // PROPS
  const {notificationObject, id = `n_${props.notificationObject['sid']}`, className, index, onVote, loadingVote, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // Contribution
  const contributionType = getContributeType(notificationObject);
  const feedObjectType = contributionType === SCCommentTypologyType ? getContributeType(notificationObject[contributionType]) : contributionType;
  const feedObjectId =
    contributionType === SCCommentTypologyType ? notificationObject[SCCommentTypologyType][feedObjectType] : notificationObject[contributionType].id;

  // INTL
  const intl = useIntl();

  /**
   * Renders root object
   */
  return (
    <Root id={id} className={classNames(classes.root, className)} {...rest}>
      <ListItem alignItems="flex-start" component={'div'}>
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>
            <Avatar alt={notificationObject.user.username} variant="circular" src={notificationObject.user.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="div" sx={{display: 'inline'}} color="inherit">
              {notificationObject.is_new && <NewChip />}
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.user)}>
                {notificationObject.user.username}
              </Link>{' '}
              {intl.formatMessage(messages.appreciated, {
                username: notificationObject.user.username,
                b: (...chunks) => <strong>{chunks}</strong>
              })}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Link
                to={scRoutingContext.url(
                  SCRoutes[`${contributionType.toUpperCase()}_ROUTE_NAME`],
                  getRouteData(notificationObject[contributionType])
                )}
                sx={{textDecoration: 'underline'}}>
                <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject[contributionType].summary}} />
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
  );
}
