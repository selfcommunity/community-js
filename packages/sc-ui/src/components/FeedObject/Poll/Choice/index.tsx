import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, Logger, SCFeedObjectType, SCPollChoiceType} from '@selfcommunity/core';
import {Box, Button, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {AxiosResponse} from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';
import {LoadingButton} from '@mui/lab';

const PREFIX = 'SCChoices';

const classes = {
  root: `${PREFIX}-root`,
  vote: `${PREFIX}-vote`,
  voted: `${PREFIX}-voted`,
  display: `${PREFIX}-display`,
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
  [`& .${classes.display}`]: {
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

export default function Choice({
  choiceObj = null,
  feedObject = null,
  vote = null,
  votes = null,
  isVoting = null,
  ...rest
}: {
  isVoting?: number;
  feedObject?: SCFeedObjectType;
  choiceObj?: SCPollChoiceType;
  [p: string]: any;
}): JSX.Element {
  const disabled = !feedObject;

  function renderVotes(voteCount, totalVotes) {
    if (totalVotes === 0) {
      return 0;
    }
    return (100 * voteCount) / totalVotes;
  }

  const c = (
    <React.Fragment>
      <div className={classes.display}>
        <LoadingButton
          loading={isVoting === choiceObj.id}
          variant="outlined"
          size="small"
          disabled={disabled || isVoting !== null}
          className={choiceObj.voted ? classes.voted : classes.vote}
          onClick={() => vote(choiceObj)}>
          {choiceObj.voted ? <CheckIcon /> : <FormattedMessage id="ui.feedObject.poll.choice.vote" defaultMessage="ui.feedObject.poll.choice.vote" />}
        </LoadingButton>
        <Typography>{choiceObj.choice}</Typography>
      </div>
      <LinearProgressWithLabel className={classes.progress} value={renderVotes(choiceObj.vote_count, votes)} />
    </React.Fragment>
  );

  /**
   * Render root element
   */
  return <Root {...rest}>{c}</Root>;
}
