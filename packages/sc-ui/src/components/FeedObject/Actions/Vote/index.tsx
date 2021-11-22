import React, {useEffect, useMemo, useReducer} from 'react';
import BaseDialog from '../../../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';
import {Button, Divider, IconButton, List, Tooltip, Typography} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';
import VoteFilledIcon from '@mui/icons-material/ThumbUpTwoTone';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import {AxiosResponse} from 'axios';
import CentralProgress from '../../../../shared/CentralProgress';
import User from '../../../User';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import {
  Endpoints,
  http,
  Logger,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCTagType,
  SCUserContextType,
  useSCFetchFeedObject,
  useSCUser
} from '@selfcommunity/core';

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
 * authReducer manage the state of authentication
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
 * Define initial state
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

export default function Vote({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
  withAction = false,
  inlineAction = true,
  ...rest
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
  withAction: boolean;
  inlineAction: boolean;

  [p: string]: any;
}): JSX.Element {
  const {obj, setObj} = useSCFetchFeedObject({id, feedObject, feedObjectType});
  const [state, dispatch] = useReducer(votesReducer, {}, () => stateInitializer({id, feedObject, feedObjectType}));
  const scUserContext: SCUserContextType = useSCUser();

  /**
   * Fetch Votes only if obj
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
   * Open dialog votes
   */
  function handleToggleVotesDialog() {
    dispatch({type: voteActionTypes.TOGGLE_VOTE_DIALOG});
  }

  /**
   * fetchVotes
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
   * vote up/down
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
   * Perform voteUp/voteDown
   */
  function vote() {
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
  }

  /**
   * Render inline action (as button if withAction==true && inlineAction==true)
   * @return {JSX.Element}
   */
  function renderInlineStartVoteBtn() {
    const canVote = scUserContext.user.id !== obj.author.id;
    const {loading, voting} = state;
    if (!canVote || (withAction && !inlineAction)) {
      return obj.voted ? <VoteFilledIcon sx={{fontSize: '1rem'}} /> : <VoteIcon sx={{fontSize: '1rem'}} />;
    }
    return (
      <Tooltip title={loading || voting ? '' : obj.voted ? 'Vote down' : 'Vote up'}>
        <IconButton disabled={loading || voting} onClick={vote} edge={loading ? false : 'end'} size="large">
          {voting ? (
            <CircularProgress size={14} style={{marginTop: -7}} />
          ) : (
            <React.Fragment>{obj.voted ? <VoteFilledIcon fontSize="small" /> : <VoteIcon fontSize="small" />}</React.Fragment>
          )}
        </IconButton>
      </Tooltip>
    );
  }

  /**
   * Render audience with detail dialog
   * @return {JSX.Element}
   */
  function renderAudience() {
    const {loadingVotes, votes, openVotesDialog} = state;
    let audience;
    if (!obj) {
      audience = (
        <Button variant="text" size="small" disabled>
          <Skeleton animation="wave" height={18} width={50} />
        </Button>
      );
    } else if (obj.vote_count <= 0) {
      audience = (
        <Button variant="text" size="small" onClick={handleToggleVotesDialog} disabled>
          {renderInlineStartVoteBtn()}
          <Typography variant={'body2'} sx={{marginLeft: (theme) => theme.spacing()}}>
            {`${obj.vote_count} Votes`}
          </Typography>
        </Button>
      );
    } else {
      audience = (
        <React.Fragment>
          <Button variant="text" size="small" onClick={handleToggleVotesDialog} disabled={obj.vote_count === 0}>
            {renderInlineStartVoteBtn()}
            <Typography variant={'body2'} sx={{marginLeft: (theme) => theme.spacing()}}>
              {obj.voted ? (
                <React.Fragment>{obj.vote_count === 1 ? `You` : `You + ${obj.vote_count - 1}`}</React.Fragment>
              ) : (
                <React.Fragment>{`${obj.vote_count} Votes`}</React.Fragment>
              )}
            </Typography>
          </Button>
          {openVotesDialog && (
            <BaseDialog
              title={<FormattedMessage defaultMessage="votesObject.title" id="votesObject.title" />}
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
                        <FormattedMessage id="votesObject.noOtherLikes" defaultMessage="votesObject.noOtherLikes" />
                      </b>
                    </p>
                  }>
                  <List>
                    {votes.map((vote, index) => (
                      <User elevation={0} user={vote.user} key={index} sx={{m: 0}}/>
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
   * Render vote action if withAction==true
   * @return {JSX.Element}
   */
  function renderVoteBtn() {
    const {voting} = state;
    const canVote = scUserContext.user.id !== obj.author.id;
    return (
      <React.Fragment>
        {withAction && !inlineAction && (
          <React.Fragment>
            <Divider />
            <Tooltip title={voting ? '' : obj.voted ? 'Vote down' : 'Vote up'}>
              <span>
                <LoadingButton loading={voting} disabled={!canVote || !obj} onClick={vote}>
                  <React.Fragment>{obj.voted ? <VoteFilledIcon fontSize="small" /> : <VoteIcon fontSize="small" />}</React.Fragment>
                </LoadingButton>
              </span>
            </Tooltip>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {renderAudience()}
      {renderVoteBtn()}
    </React.Fragment>
  );
}
