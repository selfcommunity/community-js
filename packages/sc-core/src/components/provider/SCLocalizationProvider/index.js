import React from 'react';
import PropTypes from 'prop-types';

class SCLocalizationProvider extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

SCLocalizationProvider.propTypes = {
  children: PropTypes.node,
  locale: PropTypes.object,
};

export default SCLocalizationProvider;
