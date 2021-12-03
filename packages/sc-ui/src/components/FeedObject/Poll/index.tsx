import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {SCFeedObjectType, SCPollChoiceType, SCPollType} from '@selfcommunity/core';
import {CardContent, CardHeader, Typography} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import List from '@mui/material/List';
import Choice from './Choice';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';

const messages = defineMessages({
  title: {
    id: 'ui.feedObject.poll.title',
    defaultMessage: 'ui.feedObject.poll.title'
  },
  expDate: {
    id: 'ui.feedObject.poll.expDate',
    defaultMessage: 'ui.feedObject.poll.expDate'
  },
  voters: {
    id: 'ui.feedObject.poll.voters',
    defaultMessage: 'ui.feedObject.poll.voters'
  },
  votes: {
    id: 'ui.feedObject.poll.votes',
    defaultMessage: 'ui.feedObject.poll.votes'
  }
});

const PREFIX = 'SCPollObject';

const classes = {
  root: `${PREFIX}-root`,
  poll: `${PREFIX}-poll`,
  voters: `${PREFIX}-voters`,
  votes: `${PREFIX}-votes`,
  title: `${PREFIX}-title`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  background: theme.palette.grey['A100'],
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  '& .MuiCardHeader-root': {
    textAlign: 'center',
    marginTop: '-11px',
    marginLeft: '-11px',
    width: '100%',
    maxHeight: '10px',
    background: theme.palette.grey['A200']
  },
  [`& .${classes.poll}`]: {
    textAlign: 'center'
  },
  [`& .${classes.voters}`]: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
      width: '0.7em',
      marginRight: '5px'
    }
  },
  [`& .${classes.votes}`]: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
      width: '1em',
      marginRight: '5px'
    }
  },
  [`& .${classes.title}`]: {
    textTransform: 'uppercase'
  },
  '& .MuiTypography-root': {
    fontSize: '1rem'
  }
}));

export interface PollObjectProps {
  /**
   * Poll object
   */
  pollObject: SCPollType;
  /**
   * If `false`, the poll is not votable
   * @default false
   */
  disabled?: boolean;
  /**
   * callback to sync poll obj of the feedObject
   * @param value
   */
  onChange?: (value: any) => void;
  /**
   * Any othe properties
   */
  feedObject?: SCFeedObjectType;
  [p: string]: any;
}

export default function PollObject({feedObject = null, pollObject = null, disabled = null, onChange = null, ...rest}: PollObjectProps): JSX.Element {
  const intl = useIntl();
  const [obj, setObj] = useState<SCPollType>(pollObject);
  const [votes, setVotes] = useState(getVotes());
  const multipleChoices = pollObject['multiple_choices'];

  const handleVote = () => {
    setVotes((prevVotes) => prevVotes + 1);
  };

  const handleUnVote = () => {
    setVotes((prevVotes) => prevVotes - 1);
  };

  function getVotes() {
    const choices = pollObject.choices;
    let totalVotes = 0;
    for (let i = 0; i < choices.length; i++) {
      totalVotes += choices[i].vote_count;
    }
    return totalVotes;
  }

  /**
   * Render the poll object
   */
  let objElement = <></>;
  if (pollObject) {
    objElement = (
      <>
        <CardHeader title={`${intl.formatMessage(messages.title)}`} className={classes.title} />
        <CardContent>
          <Typography variant="body1" gutterBottom className={classes.poll}>
            {obj.title}
          </Typography>
          <Typography variant="body2" gutterBottom className={classes.poll}>
            {`${intl.formatMessage(messages.expDate)}`}
            {`${intl.formatDate(Date.parse(obj.expiration_at), {year: 'numeric', month: 'numeric', day: 'numeric'})}`}
          </Typography>
          <List>
            {pollObject.choices.map((choice: SCPollChoiceType) => (
              <Choice
                elevation={0}
                choiceObj={choice}
                key={choice.id}
                feedObject={disabled ? null : feedObject}
                votes={votes}
                onVote={handleVote}
                onUnVote={handleUnVote}
              />
            ))}
          </List>
          {multipleChoices ? (
            <div className={classes.votes}>
              <ListOutlinedIcon />
              <Typography>{`${intl.formatMessage(messages.votes, {total: votes})}`}</Typography>
            </div>
          ) : (
            <div className={classes.voters}>
              <PeopleAltOutlinedIcon />
              <Typography>{`${intl.formatMessage(messages.voters, {total: votes})}`}</Typography>
            </div>
          )}
        </CardContent>
      </>
    );
  }

  /**
   * Render root element
   */
  return <Root {...rest}>{objElement}</Root>;
}
