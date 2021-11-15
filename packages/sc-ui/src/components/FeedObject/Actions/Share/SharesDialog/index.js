import React from 'react';
import BaseDialog from 'community/components/ui/Dialogs/Base';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import http from 'community/utils/http';
import endpoints from 'community/constants/Endpoints';
import CentralProgress from 'community/components/ui/CentralProgress';
import {List} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import {connect} from 'react-redux';
import User from 'community/components/widgets/User';
import Typography from '@mui/material/Typography';

class SharesDialog extends React.Component {
  constructor(props) {
    super(props);
    const thread = this.props.object[this.props.object.type];
    this.state = {
      isLoading: true,
      shares: [],
      hasMore: true,
      next: `${this.props.portal}${endpoints.VotesList.url({type: this.props.object.type, id: thread.id})}`
    };
    this.fetchShares = this.fetchShares.bind(this);
  }

  componentDidMount() {
    this.fetchShares();
  }

  fetchShares() {
    http
      .request({
        url: this.state.next,
        method: endpoints.VotesList.method
      })
      .then((res) => {
        const data = res.data;
        const newlikes = [...data.results, ...this.state.shares];
        this.setState({shares: newlikes, isLoading: false, hasMore: data.next !== null});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {open, onClose} = this.props;
    const {shares, isLoading, hasMore} = this.state;
    return (
      <BaseDialog title={<FormattedMessage defaultMessage="sharesDialog.title" id="sharesDialog.title" />} onClose={onClose} open={open}>
        {isLoading ? (
          <CentralProgress size={50} />
        ) : (
          <InfiniteScroll
            dataLength={shares.length}
            next={this.fetchShares}
            hasMore={hasMore}
            loader={<CentralProgress size={30} />}
            height={400}
            endMessage={
              <Typography variant="body2" align="center">
                <b>
                  <FormattedMessage id="sharesDialog.noOtherShares" defaultMessage="sharesDialog.noOtherShares" />
                </b>
              </Typography>
            }>
            <List>
              {shares.slice(0, 4).map((like, index) => (
                <User contained={false} user={like.user} key={index} />
              ))}
            </List>
          </InfiniteScroll>
        )}
      </BaseDialog>
    );
  }
}

SharesDialog.propTypes = {
  portal: PropTypes.string.isRequired,
  object: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    portal: state.settings.portal
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SharesDialog);
