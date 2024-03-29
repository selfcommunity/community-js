import React from 'react';
import {styled} from '@mui/material/styles';
import {SCContextType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/react-core';
import {SCFeedObjectType, SCPollChoiceType} from '@selfcommunity/types';
import {Box, Card, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';
import {LoadingButton} from '@mui/lab';
import classNames from 'classnames';
import {PREFIX} from '../../constants';

const classes = {
  root: `${PREFIX}-poll-object-choices-root`,
  label: `${PREFIX}-poll-object-choices-label`,
  vote: `${PREFIX}-poll-object-choices-vote`,
  progress: `${PREFIX}-poll-object-choices-progress`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'PollObjectChoicesRoot'
})(() => ({}));

export interface ChoiceObjectProps {
  /**
   * Choice object
   */
  choiceObj: SCPollChoiceType;
}

function LinearProgressWithLabel({className, ...props}: LinearProgressProps & {value: number}) {
  return (
    <Box className={className}>
      <LinearProgress variant="determinate" {...props} />
      <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
    </Box>
  );
}
export interface ChoiceProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The id of the selected choice
   */
  isVoting?: number;
  /**
   * Feed object
   */
  feedObject?: SCFeedObjectType;
  /**
   * Choice object
   */
  choiceObj?: SCPollChoiceType;
  /**
   * If `true`, the choice is not votable because poll is closed
   * @default null
   */
  votable?: boolean;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function Choice(props: ChoiceProps): JSX.Element {
  //PROPS
  const {className = null, choiceObj = null, feedObject = null, vote = null, votes = null, isVoting = null, votable = null, ...rest} = props;
  const disabled = !feedObject;
  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  const handleVoteAction = () => {
    if (!scUserContext.user) {
      scContext.settings.handleAnonymousAction();
    } else {
      vote(choiceObj);
    }
  };

  /**
   * Renders total votes in percentage
   */
  function renderVotes(voteCount, totalVotes) {
    if (totalVotes === 0) {
      return 0;
    }
    return (100 * voteCount) / totalVotes;
  }

  /**
   * Renders root element
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Typography className={classes.label}>{choiceObj.choice}</Typography>
      <LinearProgressWithLabel className={classes.progress} value={renderVotes(choiceObj.vote_count, votes)} />
      <LoadingButton
        loading={isVoting === choiceObj.id}
        variant={choiceObj.voted ? 'contained' : 'outlined'}
        size="small"
        disabled={disabled || isVoting !== null || votable}
        className={classes.vote}
        onClick={handleVoteAction}>
        {choiceObj.voted ? (
          <Icon>check</Icon>
        ) : (
          <FormattedMessage id="ui.feedObject.poll.choice.vote" defaultMessage="ui.feedObject.poll.choice.vote" />
        )}
      </LoadingButton>
    </Root>
  );
}
