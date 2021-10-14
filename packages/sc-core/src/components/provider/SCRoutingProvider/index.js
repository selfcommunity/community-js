import React from 'react';
import PropTypes from 'prop-types';

class SCRoutingProvider extends React.Component {
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

SCRoutingProvider.propTypes = {
  children: PropTypes.node
};

export default SCRoutingProvider;
