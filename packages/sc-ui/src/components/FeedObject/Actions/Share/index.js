import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, injectIntl} from 'react-intl';
import {Box, Button, Divider, IconButton, Tooltip, Typography} from '@mui/material';
import ShareIcon from '@mui/icons-material/ShareOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import SharesDialog from 'community/components/ui/FeedObject/Actions/Share/SharesDialog';

const messages = defineMessages({
  shares: {
    id: 'feedObject.audience.shares',
    defaultMessage: 'feedObject.audience.shares'
  },
  share: {
    id: 'feedObject.actions.share',
    defaultMessage: 'feedObject.actions.share'
  }
});

class Share extends React.Component {
  constructor(props) {
    super(props);
    const contribute = this.props.object[this.props.object.type];
    this.state = {
      contribute,
      isSharing: false,
      openSharesDialog: false,
      sharesCount: contribute['share_count']
    };

    this.share = this.share.bind(this);
    this.renderInlineStartShareBtn = this.renderInlineStartShareBtn.bind(this);
    this.renderAudience = this.renderAudience.bind(this);
    this.renderShareBtn = this.renderShareBtn.bind(this);
    this.handleToggleSharesDialog = this.handleToggleSharesDialog.bind(this);
  }

  /**
   * Open dialog shares
   */
  handleToggleSharesDialog() {
    this.setState((prevState) => ({openSharesDialog: !prevState.openSharesDialog}));
  }

  /**
   * Perform share contribute
   */
  share() {
    this.setState({isSharing: true}, () => {
      // Open Editor with contribute to share attached
    });
  }

  /**
   * Render inline action (as button if withAction==true && inlineAction==true)
   * @return {JSX.Element}
   */
  renderInlineStartShareBtn() {
    const {withAction, inlineAction, intl} = this.props;
    const {isLoading, isSharing} = this.state;
    if (withAction && inlineAction) {
      return (
        <Tooltip title={isLoading || isSharing ? '' : intl.formatMessage(messages.share)}>
          <IconButton disabled={isLoading || isSharing} onClick={this.share} edge={isLoading ? false : 'end'} size="large">
            {this.state.isSharing ? (
              <Box style={{padding: 10}}>
                <CircularProgress size={14} style={{marginTop: -2}} />
              </Box>
            ) : (
              <React.Fragment>
                <ShareIcon fontSize="small" />
              </React.Fragment>
            )}
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  }

  /**
   * Render audience with detail dialog
   * @return {JSX.Element}
   */
  renderAudience() {
    const {object} = this.props;
    const {sharesCount, openSharesDialog} = this.state;
    return (
      <Box>
        {this.renderInlineStartShareBtn()}
        <Button variant="text" size="small" onClick={this.handleToggleSharesDialog} disabled={sharesCount < 1}>
          <Typography variant={'body2'}>
            <React.Fragment>{`${sharesCount} ${this.props.intl.formatMessage(messages.shares)}`}</React.Fragment>
          </Typography>
        </Button>
        {openSharesDialog && sharesCount > 0 && <SharesDialog object={object} open={openSharesDialog} onClose={this.handleToggleSharesDialog} />}
      </Box>
    );
  }

  /**
   * Render vote action if withAction==true
   * @return {JSX.Element}
   */
  renderShareBtn() {
    const {withAction, inlineAction, intl} = this.props;
    const {isLoading, isSharing} = this.state;
    return (
      <React.Fragment>
        {withAction && !inlineAction && (
          <React.Fragment>
            <Divider />
            <Tooltip title={isLoading || isSharing ? '' : intl.formatMessage(messages.share)}>
              <LoadingButton loading={isLoading || isSharing} onClick={this.share}>
                <ShareIcon fontSize="small" />
              </LoadingButton>
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
        {this.renderShareBtn()}
      </React.Fragment>
    );
  }
}

Share.defaultProps = {
  withAction: false,
  inlineAction: true
};

Share.propTypes = {
  object: PropTypes.object.isRequired,
  withAction: PropTypes.bool,
  inlineAction: PropTypes.bool,

  /* Translation */
  intl: PropTypes.object.isRequired
};

export default injectIntl(Share);
