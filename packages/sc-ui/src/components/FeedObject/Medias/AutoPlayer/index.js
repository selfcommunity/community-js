import React from 'react';
import {Waypoint} from 'react-waypoint';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';

class AutoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldPlay: false
    };
    this.handleEnterViewport = this.handleEnterViewport.bind(this);
    this.handleExitViewport = this.handleExitViewport.bind(this);
  }

  handleEnterViewport() {
    if (this.props.enableAutoplay) {
      this.setState({shouldPlay: true});
    }
  }

  handleExitViewport() {
    this.setState({shouldPlay: false});
  }

  render() {
    const {enableAutoplay, loop, muted, controls, stopOnUnmount, pip} = this.props;
    const {shouldPlay} = this.state;
    return (
      <Waypoint scrollableAncestor={window} onEnter={this.handleEnterViewport} onLeave={this.handleExitViewport}>
        <div>
          <ReactPlayer
            config={{
              youtube: {
                playerVars: {rel: 0}
              }
            }}
            enableAutoplay={enableAutoplay}
            loop={loop}
            controls={controls}
            stopOnUnmount={stopOnUnmount}
            pip={pip}
            playing={shouldPlay}
            {...this.props}
            muted={muted}
          />
        </div>
      </Waypoint>
    );
  }
}

AutoPlayer.defaultProps = {
  enableAutoplay: true,
  loop: false,
  muted: true,
  controls: true,
  stopOnUnmount: true,
  pip: true
};

AutoPlayer.propTypes = {
  enableAutoplay: PropTypes.bool,
  muted: PropTypes.bool,
  loop: PropTypes.bool,
  controls: PropTypes.bool,
  stopOnUnmount: PropTypes.bool,
  pip: PropTypes.bool
};

export default AutoPlayer;
