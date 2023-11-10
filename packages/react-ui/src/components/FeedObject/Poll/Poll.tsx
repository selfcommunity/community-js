import React, {useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCFeedObjectType, SCPollChoiceType, SCPollType} from '@selfcommunity/types';
import {Button, CardContent, CardHeader, Collapse, ListItem, Typography} from '@mui/material';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import List from '@mui/material/List';
import Choice from './Choice';
import Icon from '@mui/material/Icon';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import classNames from 'classnames';
import {PREFIX} from '../constants';

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

const classes = {
  root: `${PREFIX}-poll-object-root`,
  voters: `${PREFIX}-poll-object-voters`,
  votes: `${PREFIX}-poll-object-votes`,
  toggleButton: `${PREFIX}-poll-object-toggle-button`,
  title: `${PREFIX}-poll-object-title`,
  expiration: `${PREFIX}-poll-object-expiration`,
  closed: `${PREFIX}-poll-object-closed`,
  expandIcon: `${PREFIX}-poll-object-expand-icon`,
  collapsedIcon: `${PREFIX}-poll-object-collapsed-icon`
};

const Root = styled(Card, {
  name: PREFIX,
  slot: 'PollObjectRoot'
})(() => ({}));

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
   * If `false`, the poll is collapsed
   * @default false
   */
  visible?: boolean;
  /**
   * Callback to sync poll obj of the feedObject
   * @param value
   */
  onChange?: (value: any) => void;
  /**
   * Callback onToggle poll visibility
   * @param value
   */
  onToggleVisibility?: (visible: any) => void;
  /**
   * Feed object
   */
  feedObject?: SCFeedObjectType;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function PollObject(props: PollObjectProps): JSX.Element {
  //  PROPS
  const {className, feedObject, pollObject, disabled, visible = true, onChange, onToggleVisibility, ...rest} = props;

  // INTL
  const intl = useIntl();

  //STATE
  const [obj, setObj] = useState<SCPollType>(pollObject);
  const [votes, setVotes] = useState(getVotes());
  const [choices, setChoices] = useState(pollObject.choices);
  const [isVoting, setIsVoting] = useState<number>(null);
  const [collapsed, setCollapsed] = useState<boolean>(!visible);

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
      .then((res: HttpResponse<any>) => {
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
      onToggleVisibility && onToggleVisibility(collapsed);
      setCollapsed((prev) => !prev);
    },
    [setCollapsed, onToggleVisibility]
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
                className={classes.toggleButton}
                onClick={handleToggleCollapsedClick}
                aria-expanded={collapsed}
                endIcon={<Icon className={classNames(classes.expandIcon, {[classes.collapsedIcon]: collapsed})}>arrow_upward</Icon>}>
                {collapsed ? intl.formatMessage(messages.showPoll) : intl.formatMessage(messages.hidePoll)}
              </Button>
            </>
          }
        />
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body1" className={classes.title}>
              {obj.title}
            </Typography>
            {obj.expiration_at && Date.parse(obj.expiration_at as string) >= new Date().getTime() && (
              <Typography variant="body2" className={classes.expiration}>
                {`${intl.formatMessage(messages.expDate)}`}
                {`${intl.formatDate(Date.parse(obj.expiration_at as string), {year: 'numeric', month: 'numeric', day: 'numeric'})}`}
              </Typography>
            )}
            {obj.closed && (
              <Typography variant="body2" className={classes.closed}>
                <FormattedMessage id="ui.feedObject.poll.closed" defaultMessage="ui.feedObject.poll.closed" />
              </Typography>
            )}
            <List>
              {choices.map((choice: SCPollChoiceType, index) => (
                <ListItem key={index}>
                  <Choice
                    elevation={0}
                    choiceObj={choice}
                    feedObject={disabled ? null : feedObject}
                    votes={votes}
                    vote={vote}
                    isVoting={isVoting}
                    votable={votable}
                  />
                </ListItem>
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

  useEffect(() => {
    setChoices(pollObject.choices);
  }, [pollObject.choices]);

  /**
   * Renders root element
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {objElement}
    </Root>
  );
}
