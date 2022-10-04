import React, {useEffect, useMemo, useReducer, useState} from 'react';
import BaseDialog from '../../../../shared/BaseDialog';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {Box, Button, Divider, List, ListItem, Tab, Tabs, Tooltip} from '@mui/material';
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
import {SCFeedObjectType, SCFeedObjectTypologyType, SCTagType} from '@selfcommunity/types';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {
  SCContextType,
  SCFeatures,
  SCUserContextType,
  UserUtils,
  useSCContext,
  useSCFetchFeedObject,
  useSCPreferences,
  useSCUser
} from '@selfcommunity/react-core';
import {useThemeProps} from '@mui/system';
import _ from 'lodash';

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

const PREFIX = 'SCVoteObject';

const classes = {
  root: `${PREFIX}-root`,
  divider: `${PREFIX}-divider`,
  actionButton: `${PREFIX}-action-button`,
  inline: `${PREFIX}-inline`,
  inlineActionButton: `${PREFIX}-inline-action-button`,
  viewAudienceButton: `${PREFIX}-view-audience-button`,
  reactionIcon: `${PREFIX}-reaction-icon`
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
  [`& .${classes.reactionIcon}`]: {
    width: '20px',
    height: '20px'
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
  feedObjectId?: number;

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
   * Show audience.
   * @default true
   */
  withAudience?: boolean;

  /**
   * Show action
   * @default true
   */
  withAction?: boolean;

  /**
   * Inline action layout.
   * Action will be align with the audience button.
   * @default true
   */
  inlineAction?: boolean;

  /**
   * Handles action vote click
   * @default null
   */
  onVoteAction?: (data) => any;

  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function Vote(inProps: VoteProps): JSX.Element {
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

  // PREFERENCES
  const scPreferences = useSCPreferences();

  // STATE
  const {obj, setObj} = useSCFetchFeedObject({id: feedObjectId, feedObject, feedObjectType});
  const [state, dispatch] = useReducer(votesReducer, {}, () => stateInitializer({feedObjectId, feedObject, feedObjectType}));
  const [tabIndex, setTabIndex] = useState<string>('all');
  const reactionsEnabled = scPreferences.features.includes(SCFeatures.REACTION);

  // CONTEXT
  const scContext: SCContextType = useSCContext();
  const scUserContext: SCUserContextType = useSCUser();
  const {enqueueSnackbar} = useSnackbar();

  // INTL
  const intl = useIntl();

  // HANDLERS
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

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
   * Performs vote up/down
   */
  const performVote = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.Vote.url({type: obj.type, id: obj.id}),
          method: Endpoints.Vote.method
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
  function vote() {
    if (scUserContext.user) {
      if (UserUtils.isBlocked(scUserContext.user)) {
        enqueueSnackbar(<FormattedMessage id="ui.common.userBlocked" defaultMessage="ui.common.userBlocked" />, {
          variant: 'warning',
          autoHideDuration: 3000
        });
      } else {
        if (obj && !state.voting) {
          dispatch({type: voteActionTypes.VOTING});
          performVote()
            .then((data) => {
              dispatch({type: voteActionTypes.REQUEST_VOTING_SUCCESS});
              const newObj = Object.assign({}, obj, {
                voted: !obj.voted,
                vote_count: obj.voted ? obj.vote_count - 1 : obj.vote_count + 1
              });
              setObj(newObj);
              onVoteAction && onVoteAction(newObj);
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
              startIcon={
                <>
                  {!inlineAction && (
                    <>
                      {scUserContext.user && obj.voted ? (
                        <Icon fontSize="small" color="primary">
                          thumb_up
                        </Icon>
                      ) : (
                        <Icon fontSize="small">thumb_up_off_alt</Icon>
                      )}
                    </>
                  )}
                </>
              }>
              {scUserContext.user && obj.voted ? (
                <React.Fragment>
                  {obj.vote_count === 1
                    ? intl.formatMessage(messages.votedByOnlyMe)
                    : intl.formatMessage(messages.votedByMe, {total: obj.vote_count - 1})}
                </React.Fragment>
              ) : (
                <React.Fragment>{`${intl.formatMessage(messages.votes, {total: obj.vote_count})}`}</React.Fragment>
              )}
            </Button>
            {openVotesDialog && (
              <BaseDialog
                title={
                  reactionsEnabled ? (
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
                      {Object.entries(filteredVotes).map(([key, value], index) => (
                        <Tab
                          icon={
                            <Icon>
                              <img alt={key} src={value[0].reaction.image} width={20} height={20} />
                            </Icon>
                          }
                          iconPosition="start"
                          label={value.length}
                          key={index}
                          value={key}
                        />
                      ))}
                    </Tabs>
                  ) : (
                    <FormattedMessage defaultMessage="ui.feedObject.votesDialog.title" id="ui.feedObject.votesDialog.title" />
                  )
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
                              <User elevation={0} user={vote.user} key={index} sx={{m: 0}} />
                            </ListItem>
                          ))}
                        </List>
                      </InfiniteScroll>
                    </TabPanel>
                    {reactionsEnabled && (
                      <>
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
                                      <User elevation={0} user={vote.user} key={index} sx={{m: 0}} />
                                    </ListItem>
                                  ))}
                                </List>
                              </InfiniteScroll>
                            </TabPanel>
                          </React.Fragment>
                        ))}
                      </>
                    )}
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
            <Tooltip
              title={voting ? '' : obj.voted && scUserContext.user ? intl.formatMessage(messages.voteDown) : intl.formatMessage(messages.voteUp)}>
              <span>
                <LoadingButton
                  loading={voting}
                  disabled={!obj}
                  onClick={vote}
                  color="inherit"
                  classes={{root: classNames(classes.actionButton, {[classes.inlineActionButton]: inlineAction})}}>
                  {scUserContext.user && obj.voted ? (
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
    <Root className={classNames(classes.root, className, {[classes.inline]: inlineAction})} {...rest}>
      {renderAudience()}
      {renderVoteButton()}
    </Root>
  );
}
