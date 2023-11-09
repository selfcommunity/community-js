import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {Box, Button, Divider, Tooltip, Typography} from '@mui/material';
import Icon from '@mui/material/Icon';
import {Link, SCRoutingContextType, useSCFetchFeedObject, useSCRouting} from '@selfcommunity/react-core';
import {SCContributionType, SCFeedObjectType} from '@selfcommunity/types';
import {styled} from '@mui/material/styles';
import {SCFeedObjectTemplateType} from '../../../../types/feedObject';
import {getContributionRouteName, getRouteData} from '../../../../utils/contribution';
import classNames from 'classnames';
import Skeleton from '@mui/material/Skeleton';
import {PREFIX} from '../../constants';

const messages = defineMessages({
  comments: {
    id: 'ui.feedObject.comment.comments',
    defaultMessage: 'ui.feedObject.comment.comments'
  },
  comment: {
    id: 'ui.feedObject.comment.comment',
    defaultMessage: 'ui.feedObject.comment.comment'
  }
});

const classes = {
  root: `${PREFIX}-action-comment-root`,
  divider: `${PREFIX}-action-comment-divider`,
  inline: `${PREFIX}-action-comment-inline`,
  button: `${PREFIX}-action-comment-button`,
  viewAudienceButton: `${PREFIX}-action-comment-view-audience-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'ActionCommentRoot'
})(() => ({}));

export interface CommentProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed object id
   * @default null
   */
  feedObjectId?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed object type
   * @default 'post' type
   */
  feedObjectType?: Exclude<SCContributionType, SCContributionType.COMMENT>;

  /**
   * Feed Object template type
   * @default 'preview'
   */
  feedObjectTemplate?: SCFeedObjectTemplateType;

  /**
   * Show audience
   * @default true
   */
  withAudience?: boolean;

  /**
   * Show action
   * @default true
   */
  withAction?: boolean;

  /**
   * Inline action layout.
   * Action will be align with the audience button.
   * @default true
   */
  inlineAction?: boolean;

  /**
   * Handles action view all comments click
   * @default null
   */
  onViewCommentsAction?: () => any;

  /**
   * Handles action comment click
   * @default null
   */
  onCommentAction?: () => any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Comment(props: CommentProps): JSX.Element {
  // PROPS
  const {
    className,
    feedObjectId,
    feedObject,
    feedObjectType = SCContributionType.POST,
    feedObjectTemplate = SCFeedObjectTemplateType,
    withAction = true,
    withAudience = true,
    inlineAction = false,
    onViewCommentsAction,
    onCommentAction,
    ...rest
  } = props;

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});

  // CONTEXT
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // INTL
  const intl = useIntl();

  /**
   * Renders comments counter
   * @return {JSX.Element}
   */
  function renderAudience() {
    let audience;
    if (withAudience) {
      if (!obj) {
        audience = (
          <Button variant="text" size="small" disabled color="inherit">
            <Skeleton animation="wave" height={18} width={50} />
          </Button>
        );
      } else {
        audience = (
          <>
            {onViewCommentsAction ? (
              <Button variant="text" size="small" onClick={onViewCommentsAction} color="inherit">
                {`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}
              </Button>
            ) : (
              <>
                {feedObjectTemplate === SCFeedObjectTemplateType.DETAIL ? (
                  <Typography variant={'body2'}>{`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}</Typography>
                ) : (
                  <Button
                    variant="text"
                    size="small"
                    component={Link}
                    to={scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))}
                    classes={{root: classes.viewAudienceButton}}>
                    {`${intl.formatMessage(messages.comments, {total: obj.comment_count})}`}
                  </Button>
                )}
              </>
            )}
          </>
        );
      }
    }
    return audience;
  }

  /**
   * Renders commentsCounter
   * @return {JSX.Element}
   */
  function renderCommentButton() {
    let ButtonProps = {};
    if (!onCommentAction) {
      ButtonProps = {
        component: Link,
        to: scRoutingContext.url(getContributionRouteName(obj), getRouteData(obj))
      };
    }
    return (
      <>
        {withAction && (
          <React.Fragment>
            {!inlineAction && withAudience && <Divider className={classes.divider} />}
            <Tooltip title={`${intl.formatMessage(messages.comment)}`}>
              <Button onClick={onCommentAction} className={classes.button} {...ButtonProps}>
                <Icon>chat_bubble_outline</Icon>
              </Button>
            </Tooltip>
          </React.Fragment>
        )}
      </>
    );
  }

  /**
   * Renders comment action
   */
  return (
    <Root className={classNames(classes.root, className, {[classes.inline]: inlineAction})} {...rest}>
      {renderAudience()}
      {renderCommentButton()}
    </Root>
  );
}
