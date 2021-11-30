import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, SCPollChoiceType, SCPollType} from '@selfcommunity/core';
import {CardContent, CardHeader, Typography} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import List from '@mui/material/List';
import Choice from './Choice';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import {AxiosResponse} from 'axios';
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
  votable?: boolean;
  /**
   * callback to sync poll obj of the feedObject
   * @param value
   */
  onChange?: (value: any) => void;
  /**
   * Any othe properties
   */
  [p: string]: any;
}

export default function PollObject({
  feedObject = null,
  feedObjectType = null,
  pollObject = null,
  votable = true,
  onChange = null,
  ...rest
}: PollObjectProps): JSX.Element {
  const intl = useIntl();
  const [votes, setVotes] = useState<number>(null);
  const multipleChoices = pollObject['multiple_choices'];

  function fetchPollVotes() {
    http
      .request({
        url: Endpoints.PollVotesList.url({id: feedObject['id'], type: feedObjectType}),
        method: Endpoints.PollVotesList.method
      })
      .then((res: AxiosResponse<any>) => {
        setVotes(res.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchPollVotes();
  }, []);

  const onVote = () => {
    fetchPollVotes();
  };

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
            {pollObject.title}
          </Typography>
          <Typography variant="body2" gutterBottom className={classes.poll}>
            {`${intl.formatMessage(messages.expDate)}`}
            {`${intl.formatDate(Date.parse(pollObject.expiration_at), {year: 'numeric', month: 'numeric', day: 'numeric'})}`}
          </Typography>
          <List>
            {pollObject.choices.map((choice: SCPollChoiceType, index) => (
              <Choice
                elevation={0}
                choiceObj={choice}
                key={index}
                feedObject={feedObject}
                feedObjectType={feedObjectType}
                votes={votes}
                onVote={onVote}
                multipleChoices={multipleChoices}
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
