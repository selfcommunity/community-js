import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, Logger, SCFeedObjectType, SCPollChoiceType} from '@selfcommunity/core';
import {Box, Button, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {AxiosResponse} from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';

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
  onVote = null,
  onUnVote = null,
  votes = null,
  ...rest
}: {
  feedObject?: SCFeedObjectType;
  choiceObj?: SCPollChoiceType;
  multipleChoices?: boolean;
  [p: string]: any;
}): JSX.Element {
  const [obj, setObj] = useState<SCPollChoiceType>(choiceObj);
  const disabled = feedObject === null;

  function vote() {
    http
      .request({
        url: Endpoints.PollVote.url({id: feedObject.id, type: feedObject['type']}),
        method: Endpoints.PollVote.method,
        data: {
          choice: choiceObj.id
        }
      })
      .then((res: AxiosResponse<any>) => {
        setObj(
          Object.assign({}, obj, {
            voted: !obj.voted,
            vote_count: obj.voted ? obj.vote_count - 1 : obj.vote_count + 1
          })
        );
        if (obj.voted) {
          onUnVote();
        } else {
          onVote();
        }
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  function renderVotes(voteCount, totalVotes) {
    return (100 * voteCount) / totalVotes;
  }

  const c = (
    <React.Fragment>
      <div className={classes.display}>
        <Button variant="outlined" size="small" disabled={disabled} className={obj.voted ? classes.voted : classes.vote} onClick={vote}>
          {obj.voted ? <CheckIcon /> : <FormattedMessage id="ui.feedObject.poll.choice.vote" defaultMessage="ui.feedObject.poll.choice.vote" />}
        </Button>
        <Typography>{obj.choice}</Typography>
      </div>
      <LinearProgressWithLabel className={classes.progress} value={renderVotes(obj.vote_count, votes)} />
    </React.Fragment>
  );

  /**
   * Render root element
   */
  return <Root {...rest}>{c}</Root>;
}
