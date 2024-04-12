import React, {useEffect, useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {LoadingButton, LoadingButtonProps} from '@mui/lab';
import classNames from 'classnames';
import {SCCommentType, SCContributionType, SCFeedObjectType, SCGroupSubscriptionStatusType, SCReactionType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import {IconButton, Paper, Popper, Tooltip, useMediaQuery, useTheme} from '@mui/material';
import {
  SCContextType,
  SCSubscribedGroupsManagerType,
  SCThemeType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchVote,
  useSCUser
} from '@selfcommunity/react-core';
import {FormattedMessage} from 'react-intl';
import {useSnackbar} from 'notistack';
import {catchUnauthorizedActionByBlockedUser} from '../../utils/errors';

const PREFIX = 'SCVoteButton';

const classes = {
  root: `${PREFIX}-root`,
  voted: `${PREFIX}-voted`,
  popperRoot: `${PREFIX}-popper-root`,
  reactionList: `${PREFIX}-reaction-list`,
  reaction: `${PREFIX}-reaction`
};

const Root = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root, styles.voted]
})(({theme}) => ({}));

const PopperRoot = styled(Popper, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.popperRoot
})(() => ({}));

export interface VoteButtonProps extends Pick<LoadingButtonProps, Exclude<keyof LoadingButtonProps, 'onClick' | 'disabled' | 'loading'>> {
  /**
   * Id of the contribution object to vote
   * @default null
   */
  contributionId: number;
  /**
   * Type of the contribution object to vote
   * @default null
   */
  contributionType: SCContributionType;
  /**
   * Contribution object to vote
   * @default null
   */
  contribution?: SCFeedObjectType | SCCommentType | null;

  /**
   * onVote callback
   * @default null
   */
  onVote?: (contribution: SCFeedObjectType | SCCommentType) => any;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Vote Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {VoteAudienceButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCVoteButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCVoteButton-root|Styles applied to the root element.|
 |voted|.SCVoteButton-voted|Styles applied to the root element when the user has vote the contribution.|

 * @param inProps
 */
export default function VoteButton(inProps: VoteButtonProps): JSX.Element {
  // PROPS
  const props: VoteButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, contributionId, contributionType, contribution = null, onVote, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [status, setStatus] = useState<string>(null);

  // REF
  const timeoutRef = useRef(null);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const scGroupsManager: SCSubscribedGroupsManagerType = scUserContext.managers.groups;
  const {enqueueSnackbar} = useSnackbar();

  // HANDLERS
  const handleMouseEnter = (event) => {
    handleClearTimeout();
    timeoutRef.current = setTimeout(() => setAnchorEl(event.target), 1000);
  };
  const handleMouseLeave = (event) => {
    handleClearTimeout();
    timeoutRef.current = setTimeout(() => setAnchorEl(null), 500);
  };
  const handleClearTimeout = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  /**
   * If the obj has a group, checks the subscription status for the authenticated user
   */
  useEffect(() => {
    if (scUserContext?.user?.id && contribution?.group) {
      setStatus(scGroupsManager.subscriptionStatus(contribution?.group));
    }
  }, [scUserContext?.user?.id, scGroupsManager.subscriptionStatus, contribution?.group]);

  /**
   * Perform vote action
   * @param reaction
   */
  const handleVoteAction = (reaction: SCReactionType) => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else if (UserUtils.isBlocked(scUserContext.user)) {
      enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else if (contribution?.group && status !== SCGroupSubscriptionStatusType.SUBSCRIBED) {
      enqueueSnackbar(<FormattedMessage id="ui.common.group.actions.unsubscribed" defaultMessage="ui.common.group.actions.unsubscribed" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      handleVote(reaction);
    }
  };

  /**
   * Handle callback onVote
   * @param contribution
   * @param error
   */
  const handleOnVote = (contribution: SCFeedObjectType | SCCommentType, error) => {
    setAnchorEl(null);
    if (error) {
      if (!catchUnauthorizedActionByBlockedUser(error, scUserContext.managers.blockedUsers.isBlocked(contribution.author), enqueueSnackbar)) {
        enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    } else {
      onVote && onVote(contribution);
    }
  };

  // HOOKS
  const {isLoading, isVoting, contributionVoted, contributionReaction, reactions, handleVote, error} = useSCFetchVote({
    id: contributionId,
    contributionType,
    contribution,
    onVote: handleOnVote
  });
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // MEMO
  const rootProps = useMemo(() => {
    if (!reactions.default) {
      return {};
    }
    return {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    };
  }, [reactions]);

  // RENDER
  const button = (
    <Root
      onClick={
        isMobile
          ? handleMouseEnter
          : () => handleVoteAction(contributionReaction ? contributionReaction : reactions.default ? reactions.default : null)
      }
      disabled={isLoading || Boolean(error)}
      loading={isVoting}
      className={classNames(classes.root, className, {
        [classes.voted]: scUserContext.user && contributionVoted
      })}
      {...rest}
      {...rootProps}>
      {scUserContext.user && contributionVoted ? (
        contributionReaction ? (
          <Icon>
            <img alt={contributionReaction.label} src={contributionReaction.image} width="100%" height="100%" />
          </Icon>
        ) : (
          <Icon>thumb_up</Icon>
        )
      ) : (
        <Icon>thumb_up_off_alt</Icon>
      )}
    </Root>
  );

  return (
    <>
      {reactions.default ? (
        button
      ) : (
        <Tooltip
          title={
            contributionVoted ? (
              <FormattedMessage id="ui.voteButton.voteDown" defaultMessage="ui.voteButton.voteDown" />
            ) : (
              <FormattedMessage id="ui.voteButton.voteUp" defaultMessage="ui.voteButton.voteUp" />
            )
          }>
          <span>{button}</span>
        </Tooltip>
      )}
      {reactions.default && (
        <PopperRoot
          id={`vote_${contributionId}_${contributionType}_popper`}
          className={classes.popperRoot}
          open={Boolean(anchorEl) && !isVoting && !isLoading}
          anchorEl={anchorEl}
          placement="top"
          keepMounted>
          <Paper className={classes.reactionList} onMouseEnter={handleClearTimeout} onMouseLeave={handleMouseLeave}>
            {reactions.reactions.map((reaction: SCReactionType) => (
              <IconButton key={reaction.id} className={classes.reaction} onClick={() => handleVoteAction(reaction)}>
                <Icon>
                  <img alt={reaction.label} src={reaction.image} width="100%" height="100%" />
                </Icon>
              </IconButton>
            ))}
          </Paper>
        </PopperRoot>
      )}
    </>
  );
}
