import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {TextField, TextFieldProps} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';

const messages = defineMessages({
  urlError: {
    id: 'ui.common.error.url',
    defaultMessage: 'ui.common.error.url'
  }
});

const PREFIX = 'SCUrlTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const UrlTextField = (props: TextFieldProps): JSX.Element => {
  // PROPS
  const {onChange, error = false, helperText = null, ...rest} = props;

  // STATE
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value && !URL_REGEX.test(event.target.value)) {
      setErrorMsg(intl.formatMessage(messages.urlError));
    } else if (error !== null) {
      setErrorMsg(null);
    }
    onChange && onChange(event);
  };

  // RENDER
  return <Root {...rest} onChange={handleChange} error={Boolean(errorMsg) || error} helperText={errorMsg || helperText} />;
};

export default UrlTextField;
