import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, injectIntl} from 'react-intl';
import {Button, Divider, Typography} from '@mui/material';
import {connect} from 'react-redux';
import {session} from 'community/components/hoc/session';
import Link from 'community/router/Link';
import {url} from 'community/router';
import CommentIcon from '@mui/icons-material/ChatBubbleOutline';

const messages = defineMessages({
  comments: {
    id: 'feedObject.audience.comments',
    defaultMessage: 'feedObject.audience.comments'
  }
});

class Comment extends React.Component {
  constructor(props) {
    super(props);
    const contribute = this.props.object[this.props.object.type];
    this.state = {
      contribute
    };
  }

  render() {
    const {withAction, object} = this.props;
    const {contribute} = this.state;
    const comments = contribute['comment_count'];
    return (
      <React.Fragment>
        <Button variant="text" size="small" component={Link} to={url(object.type, {id: contribute.id, slug: contribute.slug})}>
          <Typography variant={'body2'}>{`${comments} ${this.props.intl.formatMessage(messages.comments)}`}</Typography>
        </Button>
        {withAction && (
          <React.Fragment>
            <Divider />
            <Button component={Link} to={url(object.type, {id: contribute.id, slug: contribute.slug})}>
              <CommentIcon fontSize="small" />
            </Button>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

Comment.defaultProps = {
  withAction: false
};

Comment.propTypes = {
  portal: PropTypes.string.isRequired,
  object: PropTypes.object.isRequired,
  withAction: PropTypes.bool,

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

export default connect(mapStateToProps, mapDispatchToProps)(session(injectIntl(Comment)));
