import React from 'react';
import {styled} from '@mui/material/styles';
import {SCContextType, SCFeedObjectType, SCPollChoiceType, SCUserContextType, useSCContext, useSCUser} from '@selfcommunity/core';
import {Box, Card, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import Icon from '@mui/material/Icon';
import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';
import {LoadingButton} from '@mui/lab';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCChoices';

const classes = {
  root: `${PREFIX}-root`,
  voteButton: `${PREFIX}-vote-button`,
  choice: `${PREFIX}-choice`,
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
  [`& .${classes.voteButton}`]: {
    marginRight: theme.spacing(1)
  },
  [`& .${classes.choice}`]: {
    display: 'inline-flex',
    margin: theme.spacing(1)
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
export default function Choice(inProps: ChoiceProps): JSX.Element {
  //PROPS
  const props: ChoiceProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
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
          variant={choiceObj.voted ? 'contained' : 'outlined'}
          size="small"
          disabled={disabled || isVoting !== null || votable}
          className={classes.voteButton}
          onClick={handleVoteAction}>
          {choiceObj.voted ? (
            <Icon>check</Icon>
          ) : (
            <FormattedMessage id="ui.feedObject.poll.choice.vote" defaultMessage="ui.feedObject.poll.choice.vote" />
          )}
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
