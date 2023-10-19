import React, { SyntheticEvent, useEffect, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { Endpoints, formatHttpErrorCode, http, HttpResponse } from '@selfcommunity/api-services';
import { SCMediaType } from '@selfcommunity/types';
import { isValidUrl } from '@selfcommunity/utils';
import { MEDIA_TYPE_URL } from '../../../../constants/Media';
import { FormattedMessage } from 'react-intl';
import { CircularProgress, Fade } from '@mui/material';
import { BaseTextFieldProps } from '@mui/material/TextField/TextField';
import { InputProps as StandardInputProps } from '@mui/material/Input/Input';
import { FilledInputProps } from '@mui/material/FilledInput';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';

export interface BaseUrlTextFieldProps extends BaseTextFieldProps {
  /**
   * Callback fired when the media is created.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onSuccess?: (media: SCMediaType) => void;
}

export interface StandardUrlTextFieldProps extends BaseUrlTextFieldProps {
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: StandardInputProps['onChange'];
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant?: 'standard';
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/api/filled-input/),
   * [`OutlinedInput`](/api/outlined-input/) or [`Input`](/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<StandardInputProps>;
}

export interface FilledUrlTextFieldProps extends BaseUrlTextFieldProps {
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: FilledInputProps['onChange'];
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant: 'filled';
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/api/filled-input/),
   * [`OutlinedInput`](/api/outlined-input/) or [`Input`](/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<FilledInputProps>;
}

export interface OutlinedUrlTextFieldProps extends BaseUrlTextFieldProps {
  /**
   * Callback fired when the value is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   */
  onChange?: OutlinedInputProps['onChange'];
  /**
   * The variant to use.
   * @default 'outlined'
   */
  variant: 'outlined';
  /**
   * Props applied to the Input element.
   * It will be a [`FilledInput`](/api/filled-input/),
   * [`OutlinedInput`](/api/outlined-input/) or [`Input`](/api/input/)
   * component depending on the `variant` prop value.
   */
  InputProps?: Partial<OutlinedInputProps>;
}

export type UrlTextFieldProps = StandardUrlTextFieldProps | FilledUrlTextFieldProps | OutlinedUrlTextFieldProps;

const INITIAL_STATE = {
  url: '',
  urlError: null
};

export default (props: UrlTextFieldProps): JSX.Element => {
  // STATE
  const [isCreating, setIsCreating] = useState(false);
  const [state, setState] = useState({...INITIAL_STATE});
  const {url, urlError} = state;

  // REFS
  const urlRef = React.useRef(url);
  urlRef.current = url;
  const timerRef = React.useRef(null);

  // PROPS
  const {helperText, error, onSuccess, ...rest} = props;

  // Component update
  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => clearTimeout(timerRef.current);
  }, []);

  // HANDLERS
  const handleChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const url = target.value.startsWith('h') ? target.value : `https://${target.value}`;
    setState({url, urlError: isValidUrl(url) ? null : 'validationError'});
  };

  const handleSubmit = (event: SyntheticEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    timerRef.current && clearTimeout(timerRef.current);
    setIsCreating(true);
    http
      .request({
        url: Endpoints.ComposerMediaCreate.url(),
        method: Endpoints.ComposerMediaCreate.method,
        data: {
          type: MEDIA_TYPE_URL,
          url: urlRef.current
        }
      })
      .then((res: HttpResponse) => {
        setState({...INITIAL_STATE});
        onSuccess && onSuccess(res.data as SCMediaType);
      })
      .catch((error) => {
        const _error = formatHttpErrorCode(error);
        setState({urlError: _error.urlError ? `urlError.${_error.urlError.error}` : _error.error, url: urlRef.current});
      })
      .then(() => setIsCreating(false));
  };

  const handlePaste = (event: SyntheticEvent) => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (isValidUrl(urlRef.current)) {
        handleSubmit(event);
      }
    }, 500);
  };

  /**
   * Renders url text field
   */
  return (
    <form method="post" onSubmit={handleSubmit}>
      <TextField
        value={url}
        type="url"
        onChange={handleChange}
        onPaste={handlePaste}
        error={error || Boolean(urlError)}
        helperText={
          helperText ||
          (urlError && (
            <FormattedMessage id={`ui.composer.media.link.add.error.${urlError}`} defaultMessage={`ui.composer.media.link.add.error.${urlError}`} />
          )) || <FormattedMessage id="ui.composer.media.link.add.help" defaultMessage="ui.composer.media.link.add.help" />
        }
        disabled={isCreating}
        {...rest}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Fade in={urlError === null && url !== ''}>
                <IconButton size="small" disabled={isCreating} type="submit">
                  {isCreating ? <CircularProgress color="primary" size={20} /> : <FormattedMessage id="ui.composer.media.link.add.submit" defaultMessage="ui.composer.media.link.add.submit" />}
                </IconButton>
              </Fade>
            </InputAdornment>
          )
        }}
      />
    </form>
  );
};
