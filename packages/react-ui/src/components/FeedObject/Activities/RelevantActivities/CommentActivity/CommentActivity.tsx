import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, Typography} from '@mui/material';
import {Link, SCRoutes, SCRoutingContextType, useSCRouting} from '@selfcommunity/react-core';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import DateTimeAgo from '../../../../../shared/DateTimeAgo';
import classNames from 'classnames';
import {ActionsRelevantActivityProps} from '../ActionsRelevantActivity';
import BaseItem from '../../../../../shared/BaseItem';
import UserDeletedSnackBar from '../../../../../shared/UserDeletedSnackBar';
import {getContributionHtml, getRouteData} from '../../../../../utils/contribution';
import {MAX_SUMMARY_LENGTH} from '../../../../../constants/Feed';
import {PREFIX} from '../../../constants';

const messages = defineMessages({
  comment: {
    id: 'ui.feedObject.relevantActivities.comment',
    defaultMessage: 'ui.feedObject.relevantActivities.comment'
  }
});

const classes = {
  root: `${PREFIX}-activity-comment-root`,
  avatar: `${PREFIX}-activity-comment-avatar`,
  username: `${PREFIX}-activity-comment-username`,
  showMoreContent: `${PREFIX}-activity-comment-show-more-content`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'ActivityCommentRoot'
})(() => ({}));

export default function CommentRelevantActivity(props: ActionsRelevantActivityProps): JSX.Element {
  // PROPS
  const {className = null, activityObject = null, ...rest} = props;

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // STATE
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  // INTL
  const intl = useIntl();

  // RENDER
  const summaryHtmlTruncated =
    'summary_truncated' in activityObject.comment
      ? activityObject.comment.summary_truncated
      : activityObject.comment.html.length >= MAX_SUMMARY_LENGTH;
  const commentHtml = 'summary_html' in activityObject.comment ? activityObject.comment.summary_html : activityObject.comment.summary;
  const summaryHtml = getContributionHtml(commentHtml, scRoutingContext.url);
  return (
    <>
      <Root
        {...rest}
        className={classNames(classes.root, className)}
        image={
          <Link
            {...(!activityObject.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)})}
            onClick={activityObject.author.deleted ? () => setOpenAlert(true) : null}>
            <Avatar alt={activityObject.author.username} variant="circular" src={activityObject.author.avatar} className={classes.avatar} />
          </Link>
        }
        primary={
          <>
            {intl.formatMessage(messages.comment, {
              username: (
                <Link
                  {...(!activityObject.author.deleted && {to: scRoutingContext.url(SCRoutes.USER_PROFILE_ROUTE_NAME, activityObject.author)})}
                  onClick={activityObject.author.deleted ? () => setOpenAlert(true) : null}
                  className={classes.username}>
                  {activityObject.author.username}
                </Link>
              ),
              comment: (
                <>
                  <Typography variant="body2" gutterBottom dangerouslySetInnerHTML={{__html: summaryHtml}} />
                  {summaryHtmlTruncated && (
                    <Link
                      to={scRoutingContext.url(SCRoutes.COMMENT_ROUTE_NAME, getRouteData(activityObject.comment))}
                      className={classes.showMoreContent}>
                      <FormattedMessage id="ui.commentObject.showMore" defaultMessage="ui.commentObject.showMore" />
                    </Link>
                  )}
                </>
              )
            })}
          </>
        }
        secondary={<DateTimeAgo date={activityObject.active_at} />}
      />
      {openAlert && <UserDeletedSnackBar open={openAlert} handleClose={() => setOpenAlert(false)} />}
    </>
  );
}
