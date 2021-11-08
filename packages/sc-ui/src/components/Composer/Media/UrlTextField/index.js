import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SubmitIcon from '@mui/icons-material/PlayArrowOutlined';
import TextField from '@mui/material/TextField';
import {http, Endpoints} from '@selfcommunity/core';
import {isValidUrl} from '@selfcommunity/core/utils/url';
import {MEDIA_TYPE_URL} from '../../../../constants/Media';
import {FormattedMessage, injectIntl} from 'react-intl';
import commonMessages from '../../../../messages/common';
import {CircularProgress, Fade} from '@mui/material';

class UrlTextField extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isCreating: false,
      url: '',
      error: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.timeout = null;
  }

  resetTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  componentWillUnmount() {
    this.resetTimeout();
  }

  handleChange(event) {
    this.setState({url: event.target.value, error: isValidUrl(event.target.value) ? null : this.props.intl.formatMessage(commonMessages.urlError)});
  }

  handlePaste() {
    this.resetTimeout();
    const self = this;
    this.timeout = setTimeout(() => {
      if (isValidUrl(self.state.url)) {
        self.handleSubmit();
      }
    }, 500);
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.resetTimeout();
    const {url} = this.state;
    this.setState({isCreating: true});
    http
      .request({
        url: Endpoints.MediaCreate.url(),
        method: Endpoints.MediaCreate.method,
        data: {
          type: MEDIA_TYPE_URL,
          url
        }
      })
      .then((res) => {
        this.props.onSuccess && this.props.onSuccess(res.data);
        this.setState({isCreating: false, url: ''});
      })
      .catch((error) => {
        this.setState(formatError(error, {isCreating: false}));
      });
  }

  render() {
    const {url, error, isCreating} = this.state;
    return (
      <form method="post" onSubmit={this.handleSubmit}>
        <TextField
          id={this.props.id}
          className={this.props.className}
          name={this.props.name}
          label={this.props.label}
          value={url}
          type="url"
          onChange={this.handleChange}
          onPaste={this.handlePaste}
          fullWidth={this.props.fullWidth}
          error={Boolean(error)}
          helperText={
            this.props.helperText ||
            error || <FormattedMessage id="thread.dialog.media.links.add.help" defaultMessage="thread.dialog.media.links.add.help" />
          }
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          variant={this.props.variant}
          margin={this.props.margin}
          disabled={isCreating}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Fade in={error === null && url !== ''}>
                  <IconButton size="small" disabled={isCreating} type="submit">
                    {isCreating ? <CircularProgress color="primary" size={20} /> : <SubmitIcon />}
                  </IconButton>
                </Fade>
              </InputAdornment>
            )
          }}
        />
      </form>
    );
  }
}

UrlTextField.defaultProps = {
  id: '',
  name: '',
  margin: 'normal',
  label: null,
  fullWidth: false,
  autoFocus: false,
  error: false,
  helperText: '',
  placeholder: '',
  variant: 'standard'
};

UrlTextField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  margin: PropTypes.string,
  label: PropTypes.node,
  onSuccess: PropTypes.func,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  variant: PropTypes.string,

  /* Translation */
  intl: PropTypes.object.isRequired
};

export default injectIntl(UrlTextField);
