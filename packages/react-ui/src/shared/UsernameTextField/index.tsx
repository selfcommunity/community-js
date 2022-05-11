import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {TextField, TextFieldProps} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {USERNAME_REGEX} from '../../constants/Account';

const messages = defineMessages({
  usernameError: {
    id: 'ui.common.error.username',
    defaultMessage: 'ui.common.error.username'
  }
});

const PREFIX = 'SCUsernameTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export default function PasswordTextField(props: TextFieldProps): JSX.Element {
  // PROPS
  const {onChange, error = false, helperText = null, ...rest} = props;

  // STATE
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value && !USERNAME_REGEX.test(event.target.value)) {
      setErrorMsg(intl.formatMessage(messages.usernameError));
    } else if (error !== null) {
      setErrorMsg(null);
    }
    onChange && onChange(event);
  };

  // RENDER
  return <Root {...rest} onChange={handleChange} error={Boolean(errorMsg) || error} helperText={errorMsg || helperText} />;
}
