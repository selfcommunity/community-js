import React, {useEffect, useMemo, useReducer} from 'react';
import BaseDialog from '../../../../shared/BaseDialog';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, Button, Divider, IconButton, List, Tooltip, Typography} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import Icon from '@mui/material/Icon';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import {AxiosResponse} from 'axios';
import CentralProgress from '../../../../shared/CentralProgress';
import User from '../../../User';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import {styled} from '@mui/material/styles';
import {
  Endpoints,
  http,
  Logger,
  SCContextType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCTagType,
  SCUserContextType,
  useSCContext,
  useSCFetchFeedObject,
  useSCUser
} from '@selfcommunity/core';
import classNames from 'classnames';

/**
 * We have complex state logic that involves multiple sub-values,
 * so useReducer is preferable to useState.
 * Define all possible auth action types label
 * Use this to export actions and dispatch an action
 */
export const voteActionTypes = {
  LOADING: '_loading_votes',
  REQUEST_VOTES_LOADING: '_request_votes_loading',
  REQUEST_VOTES_SUCCESS: '_request_votes_success',
  REQUEST_VOTES_FAILED: '_request_votes_failed',
  TOGGLE_VOTE_DIALOG: '_toggle_vote_dialog',
  REFRESHING_VOTES: '_refreshing_votes',
  VOTING: '_voting',
  REQUEST_VOTING_SUCCESS: '_request_vote_success'
};

/**
 * votesReducer manage the state of authentication
 * update the state base on action type
 * @param state
 * @param action
 */
function votesReducer(state, action) {
  switch (action.type) {
    case voteActionTypes.REQUEST_VOTES_LOADING:
      return Object.assign({}, state, {loadingVotes: true});
    case voteActionTypes.REQUEST_VOTES_SUCCESS:
      return {
        votes: state.refreshing ? [...state.votes] : [...state.votes, ...action.payload.data],
        loadingVotes: false,
        refreshing: false,
        voting: false,
        next: action.payload.next,
        openVotesDialog: state.openVotesDialog,
        error: null
      };
    case voteActionTypes.TOGGLE_VOTE_DIALOG:
      return Object.assign({}, state, {openVotesDialog: !state.openVotesDialog});
    case voteActionTypes.REQUEST_VOTES_FAILED:
      return Object.assign({}, state, {loadingVotes: false, error: action.payload.error, refreshing: false});
    case voteActionTypes.REFRESHING_VOTES:
      return Object.assign({}, state, {votes: [], loadingVotes: false, refreshing: true, error: null});
    case voteActionTypes.VOTING:
      return Object.assign({}, state, {voting: true, error: null});
    case voteActionTypes.REQUEST_VOTING_SUCCESS:
      return Object.assign({}, state, {voting: false, error: null});
    default:
      throw new Error(`Unhandled type: ${action.type}`);
  }
}

/**
 * Defines initial state
 */
function stateInitializer({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
}): any {
  const next =
    id && feedObjectType
      ? `${Endpoints.VotesList.url({type: feedObjectType, id: id})}`
      : `${Endpoints.VotesList.url({type: feedObjectType, id: feedObject.id})}`;
  return {
    votes: [],
    loadingVotes: false,
    voting: null,
    refreshing: false,
    next,
    openVotesDialog: false,
    error: null
  };
}

const PREFIX = 'SCVoteObject';

const classes = {
  root: `${PREFIX}-root`,
  divider: `${PREFIX}-divider`,
  viewVotesButton: `${PREFIX}-view-votes-button`,
  inlineVoteButton: `${PREFIX}-inlineVoteButton`
};

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

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.divider}`]: {
    borderBottom: 0
  },
  [`& .${classes.viewVotesButton}`]: {
    height: 32,
    fontSize: 15,
    textTransform: 'capitalize',
    '& p': {
      fontSize: '0.9rem'
    }
  },
  [`& .${classes.inlineVoteButton}`]: {
    backgroundColor: '#d5d5d5',
    padding: '0 3px',
    borderRadius: 10
  }
}));

export interface VoteProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Feed object id
   * @default null
   */
  id?: number;

  /**
   * Feed object
   * @default null
   */
  feedObject?: SCFeedObjectType;

  /**
   * Feed object type
   * @default 'post' type
   */
  feedObjectType?: SCFeedObjectTypologyType;

  /**
   * Manages action (if present)
   * @default false
   */
  withAction: boolean;

  /**
   * Manages inline action
   * @default true
   */
  inlineAction: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Vote(props: VoteProps): JSX.Element {
  // PROPS
  const {
    className = null,
    id = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    withAction = false,
    inlineAction = true,
    ...rest
  } = props;

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const [state, dispatch] = useReducer(votesReducer, {}, () => stateInitializer({id, feedObject, feedObjectType}));

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();

  // INTL

  const intl = useIntl();

  /**
   * Fetches Votes only if obj
   */
  useEffect(() => {
    if (obj && state.next && !state.loading && !state.refreshing && state.openVotesDialog) {
      dispatch({type: voteActionTypes.REQUEST_VOTES_LOADING});
      fetchVotes()
        .then((data) => {
          dispatch({
            type: voteActionTypes.REQUEST_VOTES_SUCCESS,
            payload: {
              next: data['next'],
              data: data['results']
            }
          });
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [state.openVotesDialog]);

  /**
   * Opens dialog votes
   */
  function handleToggleVotesDialog() {
    dispatch({type: voteActionTypes.TOGGLE_VOTE_DIALOG});
  }

  /**
   * fetches Votes
   */
  const fetchVotes = useMemo(
    () => () => {
      return http
        .request({
          url: state.next,
          method: Endpoints.VotesList.method
        })
        .then((res: AxiosResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [state.next]
  );

  /**
   * Performs vote up/down
   */
  const performVote = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Vote.url({type: feedObjectType, id: obj.id}),
          method: Endpoints.Vote.method
        })
        .then((res: AxiosResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [feedObject.id]
  );

  /**
   * Performs voteUp/voteDown
   */
  function vote() {
    if (scUserContext.user) {
      if (obj && !state.voting) {
        dispatch({type: voteActionTypes.VOTING});
        performVote()
          .then((data) => {
            dispatch({type: voteActionTypes.REQUEST_VOTING_SUCCESS});
            setObj(Object.assign({}, obj, {voted: !obj.voted, vote_count: obj.voted ? obj.vote_count - 1 : obj.vote_count + 1}));
          })
          .catch((error) => {
            Logger.error(SCOPE_SC_UI, error);
          });
      }
    } else {
      scContext.settings.handleAnonymousAction();
    }
  }

  /**
   * Renders inline action (as button if withAction==true && inlineAction==true)
   * @return {JSX.Element}
   */
  function renderInlineStartVoteBtn() {
    const canVote = scUserContext.user && scUserContext.user.id !== obj.author.id;
    const {loading, voting} = state;
    if (!canVote || (withAction && !inlineAction)) {
      return obj.voted ? (
        <Icon fontSize="medium" color="primary" className={classes.inlineVoteButton}>
          thumb_up
        </Icon>
      ) : (
        <Icon fontSize="medium" sx={{marginTop: '-1px'}}>
          thumb_up_off_alt
        </Icon>
      );
    }
    return (
      <Tooltip title={loading || voting ? '' : obj.voted ? 'Vote down' : 'Vote up'}>
        <span>
          <IconButton disabled={loading || voting} onClick={vote} edge={loading ? false : 'end'} size="large">
            {voting ? (
              <CircularProgress size={14} style={{marginTop: -7}} />
            ) : (
              <React.Fragment>{obj.voted ? <Icon fontSize="small">thumb_up</Icon> : <Icon fontSize="small">thumb_up_off_alt</Icon>}</React.Fragment>
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  /**
   * Renders audience with detail dialog
   * @return {JSX.Element}
   */
  function renderAudience() {
    const {loadingVotes, votes, openVotesDialog} = state;
    let audience;
    if (!obj) {
      audience = (
        <Button variant="text" size="small" disabled color="inherit">
          <Skeleton animation="wave" height={18} width={50} />
        </Button>
      );
    } else if (obj.vote_count <= 0) {
      audience = (
        <Button variant="text" size="small" onClick={handleToggleVotesDialog} disabled color="inherit" classes={{root: classes.viewVotesButton}}>
          {renderInlineStartVoteBtn()}
          <Typography variant={'body2'} sx={{marginLeft: (theme) => theme.spacing()}}>
            {`${intl.formatMessage(messages.votes, {total: obj.vote_count})}`}
          </Typography>
        </Button>
      );
    } else {
      audience = (
        <React.Fragment>
          <Button
            variant="text"
            size="small"
            onClick={handleToggleVotesDialog}
            disabled={obj.vote_count === 0}
            color="inherit"
            classes={{root: classes.viewVotesButton}}>
            {renderInlineStartVoteBtn()}
            <Typography variant={'body2'} sx={{marginLeft: (theme) => theme.spacing()}}>
              {obj.voted ? (
                <React.Fragment>
                  {obj.vote_count === 1
                    ? intl.formatMessage(messages.votedByOnlyMe)
                    : `${intl.formatMessage(messages.votedByMe)} + ${obj.vote_count - 1}`}
                </React.Fragment>
              ) : (
                <React.Fragment>{`${intl.formatMessage(messages.votes, {total: obj.vote_count})}`}</React.Fragment>
              )}
            </Typography>
          </Button>
          {openVotesDialog && (
            <BaseDialog
              title={<FormattedMessage defaultMessage="ui.feedObject.votesDialog.title" id="ui.feedObject.votesDialog.title" />}
              onClose={handleToggleVotesDialog}
              open={openVotesDialog}>
              {loadingVotes ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={votes.length}
                  next={fetchVotes}
                  hasMore={Boolean(state.next)}
                  loader={<CentralProgress size={30} />}
                  height={400}
                  endMessage={
                    <p style={{textAlign: 'center'}}>
                      <b>
                        <FormattedMessage id="ui.feedObject.votesDialog.noOtherLikes" defaultMessage="ui.feedObject.votesDialog.noOtherLikes" />
                      </b>
                    </p>
                  }>
                  <List>
                    {votes.map((vote, index) => (
                      <User elevation={0} user={vote.user} key={index} sx={{m: 0}} />
                    ))}
                  </List>
                </InfiniteScroll>
              )}
            </BaseDialog>
          )}
        </React.Fragment>
      );
    }
    return audience;
  }

  /**
   * Renders vote action if withAction==true
   * @return {JSX.Element}
   */
  function renderVoteBtn() {
    const {voting} = state;
    const canVote = scUserContext.user && scUserContext.user.id !== obj.author.id;
    return (
      <React.Fragment>
        {withAction && !inlineAction && (
          <React.Fragment>
            <Divider className={classes.divider} />
            <Tooltip title={voting ? '' : obj.voted ? intl.formatMessage(messages.voteDown) : intl.formatMessage(messages.voteUp)}>
              <span>
                <LoadingButton loading={voting} disabled={!obj} onClick={vote} color="inherit">
                  {obj.voted ? (
                    <Icon fontSize={'large'} color="primary">
                      thumb_up
                    </Icon>
                  ) : (
                    <Icon fontSize={'large'}>thumb_up_off_alt</Icon>
                  )}
                </LoadingButton>
              </span>
            </Tooltip>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  /**
   * Renders vote action and audience section
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {renderAudience()}
      {renderVoteBtn()}
    </Root>
  );
}
