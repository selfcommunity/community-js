import React, {useMemo, useRef, useState} from 'react';
import {styled} from '@mui/material/styles';
import {LoadingButton, LoadingButtonProps} from '@mui/lab';
import classNames from 'classnames';
import {SCCommentType, SCContributionType, SCFeedObjectType, SCFeedObjectTypologyType, SCReactionType} from '@selfcommunity/types';
import {useThemeProps} from '@mui/system';
import Icon from '@mui/material/Icon';
import {IconButton, Paper, Popper, Tooltip} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {SCUserContextType, useSCFetchVote, useSCUser} from '@selfcommunity/react-core';

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
})(({theme}) => ({}));

export interface VoteButtonProps extends LoadingButtonProps {
  /**
   * Id of the contribution object to vote
   * @default null
   */
  contributionId: number;
  /**
   * Type of the contribution object to vote
   * @default null
   */
  contributionType: SCContributionType | any;
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

const messages = defineMessages({
  voteUp: {
    id: 'ui.feedObject.vote.voteUp',
    defaultMessage: 'ui.feedObject.vote.voteUp'
  },
  voteDown: {
    id: 'ui.feedObject.vote.voteDown',
    defaultMessage: 'ui.feedObject.vote.voteDown'
  },
  votes: {
    id: 'ui.feedObject.vote.votes',
    defaultMessage: 'ui.feedObject.vote.votes'
  },
  votedByMe: {
    id: 'ui.feedObject.vote.votedByMe',
    defaultMessage: 'ui.feedObject.votedByMe.you'
  },
  votedByOnlyMe: {
    id: 'ui.feedObject.vote.votedByOnlyMe',
    defaultMessage: 'ui.feedObject.votedByOnlyMe.you'
  }
});

/**
 * > API documentation for the Community-JS Vote Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {VoteButton} from '@selfcommunity/react-ui';
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
  const {className, contributionId = null, contributionType = null, contribution = null, onVote, ...rest} = props;

  // STATE
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // REF
  const timeoutRef = useRef(null);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HANDLERS
  const handleMouseEnter = (event) => {
    handleClearTimeout();
    setTimeout(() => setAnchorEl(event.target), 1000);
  };
  const handleMouseLeave = (event) => {
    timeoutRef.current = setTimeout(() => setAnchorEl(null), 500);
  };
  const handleClearTimeout = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const handleVoteDone = (contribution: SCFeedObjectType | SCCommentType) => {
    setAnchorEl(null);
    onVote && onVote(contribution);
  };

  // HOOKS
  const {isLoading, isVoting, contributionVoted, contributionReaction, contributionReactionsCount, reactions, handleVote, error} = useSCFetchVote({
    id: contributionId,
    contributionType,
    contribution,
    onVote: handleVoteDone
  });
  const intl = useIntl();

  // MEMO
  const rootProps = useMemo(() => {
    if (!reactions.default) {
      return {};
    }
    return {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleMouseEnter,
      onTouchMove: handleMouseLeave
    };
  }, [reactions]);

  // RENDER
  const button = (
    <Root
      onClick={() => handleVote(contributionReaction ? contributionReaction : reactions.default ? reactions.default : null)}
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
        <Tooltip title={contributionVoted ? intl.formatMessage(messages.voteDown) : intl.formatMessage(messages.voteUp)}>
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
              <IconButton key={reaction.id} className={classes.reaction} onClick={() => handleVote(reaction)}>
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
