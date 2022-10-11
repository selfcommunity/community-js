import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {TextField, TextFieldProps} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {isValidPhoneNumber} from 'libphonenumber-js';

const messages = defineMessages({
  urlError: {
    id: 'ui.common.error.phone',
    defaultMessage: 'ui.common.error.phone'
  }
});

const PREFIX = 'SCPhoneTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

const PhoneTextField = (props: TextFieldProps): JSX.Element => {
  // PROPS
  const {onChange, error = false, helperText = null, ...rest} = props;

  // STATE
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value && !isValidPhoneNumber(event.target.value)) {
      setErrorMsg(intl.formatMessage(messages.urlError));
    } else if (error !== null) {
      setErrorMsg(null);
    }
    onChange && onChange(event);
  };

  // RENDER
  return <Root {...rest} onChange={handleChange} error={Boolean(errorMsg) || error} helperText={errorMsg || helperText} />;
};

export default PhoneTextField;
