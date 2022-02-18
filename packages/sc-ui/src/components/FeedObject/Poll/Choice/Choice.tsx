import React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {SCContextType, SCFeedObjectType, SCPollChoiceType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/core';
import {Box, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import CheckIcon from '@mui/icons-material/Check';
import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';
import {LoadingButton} from '@mui/lab';
import classNames from 'classnames';

const PREFIX = 'SCChoices';

const classes = {
  root: `${PREFIX}-root`,
  vote: `${PREFIX}-vote`,
  voted: `${PREFIX}-voted`,
  choice: `${PREFIX}-choice`,
  result: `${PREFIX}-result`,
  progress: `${PREFIX}-progress`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  background: theme.palette.grey['A200'],
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  [`& .${classes.vote}`]: {
    backgroundColor: theme.palette.common.white,
    marginRight: theme.spacing(1)
  },
  [`& .${classes.voted}`]: {
    backgroundColor: theme.palette.common.black,
    '&:hover': {
      backgroundColor: theme.palette.common.black
    },
    marginRight: theme.spacing(1)
  },
  [`& .${classes.choice}`]: {
    display: 'inline-flex',
    margin: theme.spacing(1)
  },
  [`& .${classes.result}`]: {
    marginLeft: theme.spacing(2)
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white
  },
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.common.black
  },
  [`& .${classes.progress}`]: {
    marginLeft: theme.spacing(1),
    height: '25px',
    backgroundColor: theme.palette.grey['A200']
  }
}));

export interface ChoiceObjectProps {
  /**
   * Choice object
   */
  choiceObj: SCPollChoiceType;
}

function LinearProgressWithLabel(props: LinearProgressProps & {value: number}) {
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Box sx={{width: '100%', mr: 1}}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{minWidth: 35}}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
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
   * Renders choice obj
   */
  const c = (
    <React.Fragment>
      <Box className={classes.choice}>
        <LoadingButton
          loading={isVoting === choiceObj.id}
          variant="outlined"
          size="small"
          disabled={disabled || isVoting !== null || votable}
          className={choiceObj.voted ? classes.voted : classes.vote}
          onClick={handleVoteAction}>
          {choiceObj.voted ? <CheckIcon /> : <FormattedMessage id="ui.feedObject.poll.choice.vote" defaultMessage="ui.feedObject.poll.choice.vote" />}
        </LoadingButton>
        <Typography>{choiceObj.choice}</Typography>
      </Box>
      <LinearProgressWithLabel className={classes.progress} value={renderVotes(choiceObj.vote_count, votes)} />
    </React.Fragment>
  );

  /**
   * Renders root element
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {c}
    </Root>
  );
}
