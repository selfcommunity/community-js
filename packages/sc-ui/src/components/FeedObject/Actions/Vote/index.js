import React from 'react';
import BaseDialog from 'community/components/ui/Dialogs/Base';
import PropTypes from 'prop-types';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';
import endpoints from 'community/constants/Endpoints';
import CentralProgress from 'community/components/ui/CentralProgress';
import {Button, Divider, IconButton, List, Tooltip, Typography} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import {connect} from 'react-redux';
import User from 'community/components/widgets/User';
import {session} from 'community/components/hoc/session';
import VoteIcon from '@mui/icons-material/ThumbUpOutlined';
import {vote} from 'community/services/vote';
import VoteFilledIcon from '@mui/icons-material/ThumbUp';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';

const messages = defineMessages({
  votes: {
    id: 'feedObject.audience.votes',
    defaultMessage: 'feedObject.audience.votes'
  },
  votedByMe: {
    id: 'feedObject.audience.votedByMe',
    defaultMessage: 'feedObject.audience.votedByMe'
  },
  votedByOnlyMe: {
    id: 'feedObject.audience.votedByOnlyMe',
    defaultMessage: 'feedObject.audience.votedByOnlyMe'
  },
  voteUp: {
    id: 'feedObject.actions.voteUp',
    defaultMessage: 'feedObject.actions.voteUp'
  },
  voteDown: {
    id: 'feedObject.actions.voteDown',
    defaultMessage: 'feedObject.actions.voteDown'
  }
});

class Vote extends React.Component {
  constructor(props) {
    super(props);
    const contribute = this.props.object[this.props.object.type];
    this.state = {
      contribute,
      isLoading: true,
      isVoting: false,
      openVotesDialog: false,
      votesCount: 0,
      votes: [],
      votedByMe: false,
      hasMore: false,
      refreshVotes: false,
      next: `${this.props.portal}${endpoints.VotesList.url({type: this.props.object.type, id: contribute.id})}`
    };

    this.fetchVotes = this.fetchVotes.bind(this);
    this.vote = this.vote.bind(this);
    this.renderInlineStartVoteBtn = this.renderInlineStartVoteBtn.bind(this);
    this.renderAudience = this.renderAudience.bind(this);
    this.renderVoteBtn = this.renderVoteBtn.bind(this);
    this.handleToggleVotesDialog = this.handleToggleVotesDialog.bind(this);
  }

  componentDidMount() {
    this.fetchVotes();
  }

  /**
   * Open dialog votes
   */
  handleToggleVotesDialog() {
    if (this.state.refreshVotes) {
      this.fetchVotes();
    }
    this.setState((prevState) => ({openVotesDialog: !prevState.openVotesDialog}));
  }

  /**
   * fetchVotes
   * If refreshVotes==true in state, refresh votes
   */
  fetchVotes() {
    const {object} = this.props;
    const {user} = this.props.session;
    const {contribute, next, refreshVotes} = this.state;
    this.setState({isLoading: true}, () => {
      vote
        .load({
          next: refreshVotes
            ? `${this.props.portal}${endpoints.VotesList.url({
                type: object.type,
                id: contribute.id
              })}`
            : next
        })
        .then((data) => {
          const votes = refreshVotes ? [...data['results']] : [...this.state.votes, ...data['results']];
          const votedByMe = user && votes.length > 0 && votes[0].user.id === user.id;
          this.setState({
            refreshVotes: false,
            votesCount: data['count'],
            votes,
            votedByMe,
            isLoading: false,
            hasMore: data['next'] !== null
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  /**
   * Perform voteUp/voteDown
   */
  vote() {
    const {object} = this.props;
    const {contribute} = this.state;
    this.setState({isVoting: true}, () => {
      vote
        .up({id: contribute.id, type: object.type})
        .then(() => {
          this.setState((prevState) => ({
            refreshVotes: true,
            votesCount: prevState.votedByMe ? prevState.votesCount - 1 : prevState.votesCount + 1,
            votedByMe: !prevState.votedByMe,
            isVoting: false
          }));
        })
        .catch((error) => {
          console.log(error);
          this.setState({isVoting: false});
        });
    });
  }

  /**
   * Render inline action (as button if withAction==true && inlineAction==true)
   * @return {JSX.Element}
   */
  renderInlineStartVoteBtn() {
    const {withAction, inlineAction, session, intl} = this.props;
    const {isLoading, contribute, isVoting, votedByMe} = this.state;
    const canVote = session.user.id !== contribute.author.id;
    if (!canVote || (withAction && !inlineAction)) {
      return votedByMe ? <VoteFilledIcon sx={{fontSize: '1rem'}} /> : <VoteIcon sx={{fontSize: '1rem'}} />;
    }
    return (
      <Tooltip title={isLoading || isVoting ? '' : votedByMe ? intl.formatMessage(messages.voteDown) : intl.formatMessage(messages.voteUp)}>
        <IconButton disabled={isLoading || isVoting} onClick={this.vote} edge={isLoading ? false : 'end'} size="large">
          {this.state.isVoting ? (
            <CircularProgress size={14} style={{marginTop: -7}} />
          ) : (
            <React.Fragment>{votedByMe ? <VoteFilledIcon fontSize="small" /> : <VoteIcon fontSize="small" />}</React.Fragment>
          )}
        </IconButton>
      </Tooltip>
    );
  }

  /**
   * Render audience with detail dialog
   * @return {JSX.Element}
   */
  renderAudience() {
    const {isLoading, votes, votesCount, votedByMe, hasMore, openVotesDialog} = this.state;
    let audience;
    if (isLoading) {
      audience = (
        <Button variant="text" size="small" disabled>
          <Skeleton animation="wave" height={18} width={50} />
        </Button>
      );
    } else if (votesCount <= 0) {
      audience = (
        <Button variant="text" size="small" onClick={this.handleToggleVotesDialog} disabled>
          {this.renderInlineStartVoteBtn()}
          <Typography variant={'body2'} sx={{marginLeft: (theme) => theme.spacing()}}>
            {`${votesCount} ${this.props.intl.formatMessage(messages.votes)}`}
          </Typography>
        </Button>
      );
    } else {
      audience = (
        <React.Fragment>
          <Button variant="text" size="small" onClick={this.handleToggleVotesDialog} disabled={isLoading}>
            {this.renderInlineStartVoteBtn()}
            <Typography variant={'body2'} sx={{marginLeft: (theme) => theme.spacing()}}>
              {votedByMe ? (
                <React.Fragment>
                  {votesCount === 1
                    ? `${this.props.intl.formatMessage(messages.votedByOnlyMe)}`
                    : `${this.props.intl.formatMessage(messages.votedByMe)} + ${votesCount - 1}`}
                </React.Fragment>
              ) : (
                <React.Fragment>{`${votesCount} ${this.props.intl.formatMessage(messages.votes)}`}</React.Fragment>
              )}
            </Typography>
          </Button>
          {openVotesDialog && (
            <BaseDialog
              title={<FormattedMessage defaultMessage="votesObject.title" id="votesObject.title" />}
              onClose={this.handleToggleVotesDialog}
              open={openVotesDialog}>
              {isLoading ? (
                <CentralProgress size={50} />
              ) : (
                <InfiniteScroll
                  dataLength={votes.length}
                  next={this.fetchVotes}
                  hasMore={hasMore}
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
                    {votes.slice(0, 4).map((vote, index) => (
                      <User elevation={0} user={vote.user} key={index} />
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
  renderVoteBtn() {
    const {withAction, inlineAction, session, intl} = this.props;
    const {isLoading, isVoting, votedByMe, contribute} = this.state;
    const canVote = session.user.id !== contribute.author.id;
    return (
      <React.Fragment>
        {withAction && !inlineAction && (
          <React.Fragment>
            <Divider />
            <Tooltip title={isLoading || isVoting ? '' : votedByMe ? intl.formatMessage(messages.voteDown) : intl.formatMessage(messages.voteUp)}>
              <span>
                <LoadingButton loading={isLoading || isVoting} disabled={!canVote} onClick={this.vote}>
                  <React.Fragment>{votedByMe ? <VoteFilledIcon fontSize="small" /> : <VoteIcon fontSize="small" />}</React.Fragment>
                </LoadingButton>
              </span>
            </Tooltip>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderAudience()}
        {this.renderVoteBtn()}
      </React.Fragment>
    );
  }
}

Vote.defaultProps = {
  withAction: false,
  inlineAction: true
};

Vote.propTypes = {
  portal: PropTypes.string.isRequired,
  object: PropTypes.object.isRequired,
  withAction: PropTypes.bool,
  inlineAction: PropTypes.bool,

  /* Session */
  session: PropTypes.object.isRequired,

  /* Translation */
  intl: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    portal: state.settings.portal,
    session: state.session
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(session(injectIntl(Vote)));
