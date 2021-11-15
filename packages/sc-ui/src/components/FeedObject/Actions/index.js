import React from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import {Grid} from '@mui/material';
import Vote from './Vote';
import Share from './Share';
import Comment from './Comment';
import LazyLoad from 'react-lazyload';

const PREFIX = 'SCFeedObjectActions';

const Root = styled(Grid, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  margin: '13px 0',
  color: '#3A3A3A'
}));

class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSharesDialog: false
    };
  }

  render() {
    const {object} = this.props;
    return (
      <LazyLoad height={360}>
        <Root container>
          <Grid item xs={4} align="center">
            <Vote object={object} withAction={true} inlineAction={false} />
          </Grid>
          <Grid item xs={4} align="center">
            <Comment object={object} withAction={true} />
          </Grid>
          <Grid item xs={4} align="center">
            <Share object={object} withAction={true} inlineAction={false} />
          </Grid>
        </Root>
      </LazyLoad>
    );
  }
}

Actions.propTypes = {
  object: PropTypes.object.isRequired
};

export default Actions;
