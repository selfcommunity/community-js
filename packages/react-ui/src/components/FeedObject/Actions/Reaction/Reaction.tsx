import React, {useEffect, useMemo, useReducer, useState, useRef} from 'react';
import BaseDialog from '../../../../shared/BaseDialog';
import {FormattedMessage} from 'react-intl';
import {Avatar, AvatarGroup, Box, Button, ClickAwayListener, Divider, List, ListItem, Tab, Tabs} from '@mui/material';
import InfiniteScroll from '../../../../shared/InfiniteScroll';
import Icon from '@mui/material/Icon';
import Skeleton from '@mui/material/Skeleton';
import LoadingButton from '@mui/lab/LoadingButton';
import CentralProgress from '../../../../shared/CentralProgress';
import User from '../../../User';
import {SCOPE_SC_UI} from '../../../../constants/Errors';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';
import {useSnackbar} from 'notistack';
import {SCFeedObjectType, SCFeedObjectTypologyType, SCReactionType, SCTagType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchFeedObject,
  useSCFetchReactions,
  useSCUser
} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import _ from 'lodash';
import {VoteProps} from '../Vote';
import ReactionsPopover from './ReactionsPopover';

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
  feedObjectId = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST
}: {
  feedObjectId?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType?: SCFeedObjectTypologyType;
}): any {
  const next =
    feedObjectId && feedObjectType
      ? `${Endpoints.VotesList.url({type: feedObjectType, id: feedObjectId})}`
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

/**
 * Action types label for reaction actions handler
 */
export const reactionActionTypes = {
  ADD: 'add',
  CHANGE: 'change',
  REMOVE: 'remove'
};

const PREFIX = 'SCReactionObject';

const classes = {
  root: `${PREFIX}-root`,
  divider: `${PREFIX}-divider`,
  actionButton: `${PREFIX}-action-button`,
  inline: `${PREFIX}-inline`,
  inlineActionButton: `${PREFIX}-inline-action-button`,
  viewAudienceButton: `${PREFIX}-view-audience-button`,
  groupedIcons: `${PREFIX}-grouped-icons`,
  reactionAvatar: `${PREFIX}-reaction-avatar`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  [`&.${classes.inline}`]: {
    flexDirection: 'row-reverse'
  },
  [`& .${classes.inlineActionButton}`]: {
    minWidth: 30
  },
  [`& .${classes.divider}`]: {
    width: '100%',
    borderBottom: 0
  },
  [`& .${classes.viewAudienceButton}`]: {
    height: 32,
    fontSize: 15,
    textTransform: 'capitalize',
    '& p': {
      fontSize: '0.9rem'
    }
  },
  [`& .${classes.groupedIcons}`]: {
    '& .MuiAvatar-root': {
      width: '20px',
      height: '20px',
      fontSize: '0.8rem'
    }
  },
  [`& .${classes.reactionAvatar}`]: {
    '& .MuiAvatar-img': {
      width: theme.spacing(2),
      height: theme.spacing(2)
    }
  }
}));

export interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string | any;
}
function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div hidden={value !== index} id={`tab-panel-${index}`} {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}

export default function Reaction(inProps: VoteProps): JSX.Element {
  const props: VoteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // PROPS
  const {
    className = null,
    feedObjectId = null,
    feedObject = null,
    feedObjectType = SCFeedObjectTypologyType.POST,
    withAudience = true,
    withAction = true,
    inlineAction = false,
    onVoteAction = () => null,
    ...rest
  } = props;

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const {reactions, isLoading} = useSCFetchReactions();
  const [state, dispatch] = useReducer(votesReducer, {}, () => stateInitializer({feedObjectId, feedObject, feedObjectType}));
  const [tabIndex, setTabIndex] = useState<string>('all');
  const [reaction, setReaction] = useState<SCReactionType>(null);
  const defaultReactionId = 1;
  const defaultReaction = reactions.find((r) => r.id === defaultReactionId);
  const popoverAnchor = useRef(null);
  const [timeout, setModalTimeout] = useState(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [reactionsList, setReactionsList] = useState<[] | any>(obj.reactions_count);

  // HANDLERS
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  function handleMouseEnter() {
    timeout && !hovered && clearTimeout(timeout);
    setModalTimeout(setTimeout(() => setHovered(true), 1500));
  }

  function handleMouseLeave() {
    timeout && clearTimeout(timeout);
    setHovered(false);
  }

  function dispatchReactionsActions(type: string, reactionObj) {
    const list = [...reactionsList];
    let updatedList;
    const index = list.findIndex((r) => r.reaction.id === reactionObj.id);
    const inList = list.length ? list.some((o) => o.reaction.id === reactionObj.id) : false;
    switch (type) {
      case reactionActionTypes.REMOVE:
        if (inList && list[index].count > 1) {
          // console.log('Update count -');
          list[index].count = list[index].count - 1;
          updatedList = list;
        } else {
          // console.log('Delete obj');
          list.splice(index, 1);
          updatedList = list;
        }
        return updatedList;
      case reactionActionTypes.ADD:
        if (inList) {
          // console.log('Update count +');
          list[index].count = list[index].count + 1;
          updatedList = list;
        } else {
          // console.log('Add obj');
          updatedList = [...list, {reaction: reactionObj, count: 1}];
        }
        return updatedList;
      case reactionActionTypes.CHANGE:
        const i = list.findIndex((r) => r.reaction.id === obj.reaction.id);
        if (!inList) {
          // console.log('Change not in list, add + update count');
          list[i].reaction = list[i].count === 1 ? reactionObj : list[i].reaction;
          list[i].count = list[i].count >= 1 ? list[i].count - 1 : list[i].count;
          setReactionsList(dispatchReactionsActions(reactionActionTypes.ADD, reactionObj));
        } else {
          // console.log('Change in list, remove + update count');
          const n = dispatchReactionsActions(reactionActionTypes.REMOVE, obj.reaction);
          const newIndex = n.findIndex((r) => r.reaction.id === reactionObj.id);
          n[newIndex].count = n[newIndex].count + 1;
          setReactionsList(n);
        }
        break;
    }
  }

  /**
   * Handles reaction actions(add, update, delete);
   * @param voted
   * @param r
   */
  function handleReactions(voted, r) {
    if (voted) {
      const forRemoval = obj.reaction.id === r.id;
      if (forRemoval) {
        setReactionsList(dispatchReactionsActions(reactionActionTypes.REMOVE, obj.reaction));
      } else {
        dispatchReactionsActions(reactionActionTypes.CHANGE, r);
      }
    } else {
      setReactionsList(dispatchReactionsActions(reactionActionTypes.ADD, r));
    }
  }

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
        .then((res: HttpResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [state.next]
  );

  /**
   * Performs vote with reactions
   */
  const performReaction = useMemo(
    () => (reaction) => {
      return http
        .request({
          url: Endpoints.Vote.url({type: obj.type, id: obj.id}),
          method: Endpoints.Vote.method,
          params: {
            reaction: reaction.id
          }
        })
        .then((res: HttpResponse<SCTagType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [obj]
  );

  /**
   * Performs voteUp/voteDown
   */
  function vote(reaction) {
    setReaction(reaction);
    if (scUserContext.user && Object.prototype.hasOwnProperty.call(obj, 'reaction')) {
      if (UserUtils.isBlocked(scUserContext.user)) {
        enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
          variant: 'warning',
          autoHideDuration: 3000
        });
      } else {
        if (obj && !state.voting) {
          dispatch({type: voteActionTypes.VOTING});
          performReaction(reaction)
            .then((data) => {
              dispatch({type: voteActionTypes.REQUEST_VOTING_SUCCESS});
              const newObj = Object.assign({}, obj, {
                voted: obj.voted && obj.reaction.id !== reaction.id ? true : !obj.voted,
                vote_count:
                  obj.voted && obj.reaction.id === reaction.id
                    ? obj.vote_count - 1
                    : obj.voted && obj.reaction.id !== reaction.id
                    ? obj.vote_count
                    : obj.vote_count + 1,
                reaction: reaction
              });
              setObj(newObj);
              handleReactions(obj.voted, reaction);
              onVoteAction && onVoteAction(newObj);
              setHovered(false);
            })
            .catch((error) => {
              Logger.error(SCOPE_SC_UI, error);
            });
        }
      }
    } else {
      scContext.settings.handleAnonymousAction();
    }
  }

  const handleReactionVote = (r) => {
    vote(r);
  };

  /**
   * Renders audience with detail dialog
   * @return {JSX.Element}
   */
  function renderAudience() {
    const {loadingVotes, votes, openVotesDialog} = state;
    const filteredVotes = _.groupBy(votes, (v) => v.reaction.label);
    let audience;
    if (withAudience) {
      if (!obj) {
        audience = (
          <Button variant="text" size="small" disabled color="inherit">
            <Skeleton animation="wave" height={18} width={50} />
          </Button>
        );
      } else {
        audience = (
          <>
            <Button
              variant="text"
              size="small"
              onClick={handleToggleVotesDialog}
              disabled={obj.vote_count === 0}
              color="inherit"
              classes={{root: classes.viewAudienceButton}}
              endIcon={obj.vote_count !== 0 ? obj.vote_count : null}>
              <AvatarGroup className={classes.groupedIcons} max={3}>
                {reactionsList.map((r: any, i) => (
                  <Avatar alt={r.reaction.label} src={r.reaction.image} key={i} className={classes.reactionAvatar} />
                ))}
              </AvatarGroup>
            </Button>
            {openVotesDialog && (
              <BaseDialog
                title={
                  <Tabs value={tabIndex} onChange={handleChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                    <Tab
                      value={'all'}
                      label={
                        <FormattedMessage
                          defaultMessage="ui.feedObject.votesDialog.reactionsEnabled.title"
                          id="ui.feedObject.votesDialog.reactionsEnabled.title"
                        />
                      }
                    />
                    {reactionsList.map((r: any, index) => (
                      <Tab
                        icon={
                          <Icon>
                            <img alt={r.reaction.label} src={r.reaction.image} width={20} height={20} />
                          </Icon>
                        }
                        iconPosition="start"
                        label={r.count}
                        key={index}
                        value={r.reaction.label}
                      />
                    ))}
                  </Tabs>
                }
                onClose={handleToggleVotesDialog}
                open={openVotesDialog}>
                {loadingVotes ? (
                  <CentralProgress size={50} />
                ) : (
                  <>
                    <TabPanel value={'all'} index={tabIndex}>
                      <InfiniteScroll
                        dataLength={votes.length}
                        next={fetchVotes}
                        hasMoreNext={Boolean(state.next)}
                        loaderNext={<CentralProgress size={30} />}
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
                            <ListItem key={index}>
                              <User elevation={0} user={vote.user} key={index} sx={{m: 0}} showReaction={true} reaction={vote.reaction} />
                            </ListItem>
                          ))}
                        </List>
                      </InfiniteScroll>
                    </TabPanel>
                    {Object.keys(filteredVotes).map((key, index) => (
                      <React.Fragment key={index}>
                        <TabPanel value={key} index={tabIndex}>
                          <InfiniteScroll
                            dataLength={votes.length}
                            next={fetchVotes}
                            hasMoreNext={Boolean(state.next)}
                            loaderNext={<CentralProgress size={30} />}
                            height={400}
                            endMessage={
                              <p style={{textAlign: 'center'}}>
                                <b>
                                  <FormattedMessage
                                    id="ui.feedObject.votesDialog.noOtherLikes"
                                    defaultMessage="ui.feedObject.votesDialog.noOtherLikes"
                                  />
                                </b>
                              </p>
                            }>
                            <List>
                              {filteredVotes[key].map((vote, index) => (
                                <ListItem key={index}>
                                  <User elevation={0} user={vote.user} key={index} sx={{m: 0}} showReaction={true} reaction={vote.reaction} />
                                </ListItem>
                              ))}
                            </List>
                          </InfiniteScroll>
                        </TabPanel>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </BaseDialog>
            )}
          </>
        );
      }
    }
    return audience;
  }

  /**
   * Renders vote action if withAction==true
   * @return {JSX.Element}
   */
  function renderVoteButton() {
    const {voting} = state;
    return (
      <React.Fragment>
        {withAction && (
          <React.Fragment>
            {!inlineAction && withAudience && <Divider className={classes.divider} />}
            <span>
              <LoadingButton
                ref={popoverAnchor}
                onClick={() => vote(obj.reaction ?? defaultReaction)}
                onTouchStart={handleMouseEnter}
                onMouseEnter={handleMouseEnter}
                loading={voting}
                disabled={!obj}
                color="inherit"
                classes={{root: classNames(classes.actionButton, {[classes.inlineActionButton]: inlineAction})}}>
                {scUserContext.user && obj.voted ? (
                  <Icon fontSize={'large'}>
                    <img alt={obj.reaction.label} src={obj.reaction.image} height={16} width={16} />
                  </Icon>
                ) : (
                  <Icon fontSize={'large'}>thumb_up_off_alt</Icon>
                )}
              </LoadingButton>
            </span>
            {hovered && (
              <ReactionsPopover
                anchorEl={popoverAnchor.current}
                open={hovered}
                onOpen={handleMouseEnter}
                onClose={handleMouseLeave}
                reactions={reactions}
                onReactionSelection={handleReactionVote}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  /**
   * Renders vote action and audience section
   */
  return (
    <Root className={classNames(classes.root, className, {[classes.inline]: inlineAction})} {...rest}>
      {renderAudience()}
      {renderVoteButton()}
    </Root>
  );
}
