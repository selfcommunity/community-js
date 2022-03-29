import React, {useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {Endpoints, http, Logger, SCFeedObjectType, SCFeedObjectTypologyType, SCPollChoiceType, SCPollType} from '@selfcommunity/core';
import {Button, CardContent, CardHeader, Collapse, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import List from '@mui/material/List';
import Choice from './Choice';
import Icon from '@mui/material/Icon';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {AxiosResponse} from 'axios';
import classNames from 'classnames';
import useThemeProps from '@mui/material/styles/useThemeProps';

const messages = defineMessages({
  showPoll: {
    id: 'ui.feedObject.poll.showPoll',
    defaultMessage: 'ui.feedObject.poll.showPoll'
  },
  hidePoll: {
    id: 'ui.feedObject.poll.hidePoll',
    defaultMessage: 'ui.feedObject.poll.hidePoll'
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
  title: `${PREFIX}-title`,
  expandIcon: `${PREFIX}-expand-icon`,
  collapsedIcon: `${PREFIX}-collapsed-icon`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderTop: `1px solid ${theme.palette.grey['A200']}`,
  borderBottom: `1px solid ${theme.palette.grey['A200']}`,
  boxShadow: 'none',
  '& .MuiCardHeader-root': {
    textAlign: 'center',
    marginLeft: '-11px',
    width: '100%',
    maxHeight: '10px'
  },
  [`& .${classes.poll}`]: {
    textAlign: 'center'
  },
  [`& .${classes.voters}`]: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiIcon-root': {
      width: '0.7em',
      marginRight: '5px'
    }
  },
  [`& .${classes.votes}`]: {
    display: 'flex',
    margin: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiIcon-root': {
      width: '1em',
      marginRight: '5px'
    }
  },
  [`& .${classes.title}`]: {
    textTransform: 'uppercase'
  },
  [`& .${classes.expandIcon}`]: {
    marginBottom: 2,
    marginLeft: -2,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  [`& .${classes.collapsedIcon}`]: {
    transform: 'rotate(180deg)'
  },
  '& .MuiTypography-root': {
    fontSize: '1rem'
  }
}));

export interface PollObjectProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
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
   * Callback to sync poll obj of the feedObject
   * @param value
   */
  onChange?: (value: any) => void;
  /**
   * Feed object
   */
  feedObject?: SCFeedObjectType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function PollObject(inProps: PollObjectProps): JSX.Element {
  //  PROPS
  const props: PollObjectProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, feedObject, pollObject, disabled, onChange, ...rest} = props;

  // INTL
  const intl = useIntl();

  //STATE
  const [obj, setObj] = useState<SCPollType>(pollObject);
  const [votes, setVotes] = useState(getVotes());
  const [choices, setChoices] = useState(pollObject.choices);
  const [isVoting, setIsVoting] = useState<number>(null);
  const [collapsed, setCollapsed] = useState<boolean>(
    Boolean(feedObject && (feedObject.type === SCFeedObjectTypologyType.DISCUSSION || feedObject.html || feedObject.medias.length))
  );

  // CONST
  const multipleChoices = pollObject['multiple_choices'];
  const votable = pollObject['closed'];

  /**
   * Handles choice upvote
   */
  const handleVote = (id) => {
    if (multipleChoices) {
      setChoices((prevChoices) => {
        return prevChoices.map((choice) =>
          Object.assign({}, choice, {
            voted: choice.id === id ? true : choice.voted,
            vote_count: choice.id === id ? choice.vote_count + 1 : choice.vote_count
          })
        );
      });
      setVotes((prevVotes) => prevVotes + 1);
    } else {
      let isVoted = false;
      setChoices((prevChoices) => {
        return prevChoices.map((choice) => {
          isVoted = isVoted || choice.voted;
          return Object.assign({}, choice, {
            voted: choice.id === id ? true : false,
            vote_count: choice.id === id ? choice.vote_count + 1 : choice.vote_count > 0 && choice.voted ? choice.vote_count - 1 : choice.vote_count
          });
        });
      });
      !isVoted && setVotes((prevVotes) => prevVotes + 1);
    }
  };

  /**
   * Handles choice unvote
   */
  const handleUnVote = (id) => {
    setChoices((prevChoices) => {
      return prevChoices.map((choice) =>
        Object.assign({}, choice, {
          voted: choice.id === id ? false : choice.voted,
          vote_count: choice.id === id && choice.vote_count > 0 ? choice.vote_count - 1 : choice.vote_count
        })
      );
    });
    setVotes((prevVotes) => prevVotes - 1);
  };

  /**
   * Gets total votes
   */
  function getVotes() {
    const choices = pollObject.choices;
    let totalVotes = 0;
    let defaultVotes = 0;
    for (let i = 0; i < choices.length; i++) {
      totalVotes += choices[i].vote_count;
    }
    return totalVotes ? totalVotes : defaultVotes;
  }

  /**
   * Performs poll vote
   */
  function vote(choiceObj) {
    setIsVoting(choiceObj.id);
    http
      .request({
        url: Endpoints.PollVote.url({id: feedObject.id, type: feedObject['type']}),
        method: Endpoints.PollVote.method,
        data: {
          choice: choiceObj.id
        }
      })
      .then((res: AxiosResponse<any>) => {
        if (choiceObj.voted) {
          handleUnVote(choiceObj.id);
        } else {
          handleVote(choiceObj.id);
        }
        setIsVoting(null);
      })
      .catch((error) => {
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  /**
   * Handle toggle collapsed/uncollapsed poll
   */
  const handleToggleCollapsedClick = useMemo(
    () => () => {
      setCollapsed((prev) => !prev);
    },
    [collapsed]
  );

  /**
   * Renders the poll object
   */
  let objElement = <></>;
  if (pollObject) {
    objElement = (
      <>
        <CardHeader
          title={
            <>
              <Button
                onClick={handleToggleCollapsedClick}
                aria-expanded={collapsed}
                endIcon={<Icon className={classNames(classes.expandIcon, {[classes.collapsedIcon]: collapsed})}>arrow_upward</Icon>}>
                {collapsed ? intl.formatMessage(messages.showPoll) : intl.formatMessage(messages.hidePoll)}
              </Button>
            </>
          }
          className={classes.title}
        />
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body1" gutterBottom align={'center'}>
              {obj.title}
            </Typography>
            {obj.expiration_at && Date.parse(obj.expiration_at as string) >= new Date().getTime() ? (
              <Typography variant="body2" gutterBottom align={'center'}>
                {`${intl.formatMessage(messages.expDate)}`}
                {`${intl.formatDate(Date.parse(obj.expiration_at as string), {year: 'numeric', month: 'numeric', day: 'numeric'})}`}
              </Typography>
            ) : (
              <Typography variant="body2" gutterBottom align={'center'}>
                <FormattedMessage id="ui.feedObject.poll.closed" defaultMessage="ui.feedObject.poll.closed" />
              </Typography>
            )}
            <List>
              {choices.map((choice: SCPollChoiceType, index) => (
                <Choice
                  elevation={0}
                  choiceObj={choice}
                  key={index}
                  feedObject={disabled ? null : feedObject}
                  votes={votes}
                  vote={vote}
                  isVoting={isVoting}
                  votable={votable}
                />
              ))}
            </List>
            {multipleChoices ? (
              <div className={classes.votes}>
                <Icon>list</Icon>
                <Typography>{`${intl.formatMessage(messages.votes, {total: votes})}`}</Typography>
              </div>
            ) : (
              <div className={classes.voters}>
                <Icon>people_alt</Icon>
                <Typography>{`${intl.formatMessage(messages.voters, {total: votes})}`}</Typography>
              </div>
            )}
          </CardContent>
        </Collapse>
      </>
    );
  }

  /**
   * Renders root element
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {objElement}
    </Root>
  );
}
