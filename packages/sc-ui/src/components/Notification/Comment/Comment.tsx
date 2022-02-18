import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Box, Grid, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography} from '@mui/material';
import {Link, SCNotificationCommentType, SCNotificationTypologyType, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import Bullet from '../../../shared/Bullet';
import {LoadingButton} from '@mui/lab';
import VoteFilledIcon from '@mui/icons-material/ThumbUpTwoTone';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';
import {grey} from '@mui/material/colors';
import DateTimeAgo from '../../../shared/DateTimeAgo';
import NewChip from '../NewChip';
import {getRouteData} from '../../../utils/contribute';
import classNames from 'classnames';

const messages = defineMessages({
  comment: {
    id: 'ui.notification.comment.comment',
    defaultMessage: 'ui.notification.comment.comment'
  },
  nestedComment: {
    id: 'ui.notification.comment.nestedComment',
    defaultMessage: 'ui.notification.comment.nestedComment'
  }
});

const PREFIX = 'SCCommentNotification';

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

export interface CommentNotificationProps {
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
  notificationObject: SCNotificationCommentType;

  /**
   * Index
   * @default null
   */
  index: number;

  /**
   * Handles action on vote
   * @default null
   */
  onVote: (i, v) => void;

  /**
   * The id of the loading vote
   * @default null
   */
  loadingVote: number;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * This component render the content of the notification of type comment/nested comment
 * @param props
 * @constructor
 */
export default function CommentNotification(props: CommentNotificationProps): JSX.Element {
  // PROPS
  const {notificationObject, index, onVote, loadingVote, id = `n_${props.notificationObject['sid']}`, className, ...rest} = props;

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
        <ListItemAvatar>
          <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)}>
            <Avatar alt={notificationObject.comment.author.username} variant="circular" src={notificationObject.comment.author.avatar} />
          </Link>
        </ListItemAvatar>
        <ListItemText
          disableTypography={true}
          primary={
            <Typography component="span" sx={{display: 'inline'}} color="primary">
              {notificationObject.is_new && <NewChip />}
              <Link to={scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, notificationObject.comment.author)}>
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
              <Link
                to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(notificationObject.comment))}
                sx={{textDecoration: 'underline'}}>
                <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: notificationObject.comment.summary}} />
              </Link>
              <Box component="span" sx={{display: 'flex', justifyContent: 'flex-start', p: '2px'}}>
                <Grid component="span" item={true} sm="auto" container direction="row" alignItems="center">
                  <DateTimeAgo date={notificationObject.active_at} />
                  <Bullet sx={{paddingLeft: '10px', paddingTop: '1px'}} />
                  <LoadingButton
                    variant={'text'}
                    sx={{marginTop: '-1px', minWidth: '30px'}}
                    onClick={() => onVote(index, notificationObject.comment)}
                    disabled={loadingVote !== null}
                    loading={loadingVote === index}>
                    {notificationObject.comment.voted ? (
                      <Tooltip
                        title={<FormattedMessage id={'ui.notification.comment.voteDown'} defaultMessage={'ui.notification.comment.voteDown'} />}>
                        <VoteFilledIcon fontSize={'small'} color={'secondary'} />
                      </Tooltip>
                    ) : (
                      <Tooltip title={<FormattedMessage id={'ui.notification.comment.voteUp'} defaultMessage={'ui.notification.comment.voteUp'} />}>
                        <VoteIcon fontSize={'small'} />
                      </Tooltip>
                    )}
                  </LoadingButton>
                </Grid>
              </Box>
            </React.Fragment>
          }
        />
      </ListItem>
    </Root>
  );
}
