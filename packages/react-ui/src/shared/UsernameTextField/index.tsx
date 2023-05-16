import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {TextField, TextFieldProps} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {USERNAME_REGEX} from '../../constants/Account';
import useInitialAutofilledInput from '../../utils/autofilledInput';

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

const UsernameTextField = (props: TextFieldProps): JSX.Element => {
  // PROPS
  const {id, value = '', onChange, InputLabelProps = {}, error = false, helperText = null, ...rest} = props;

  // STATE
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // HOOKS
  const intl = useIntl();
  const {autofilled, setAutofilledInitialized} = useInitialAutofilledInput(id, value);

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value && !USERNAME_REGEX.test(event.target.value)) {
      setErrorMsg(intl.formatMessage(messages.usernameError));
    } else if (error !== null) {
      setErrorMsg(null);
    }
    setAutofilledInitialized(true);
    onChange && onChange(event);
  };

  // RENDER
  return (
    <Root
      {...(id && {id})}
      {...(!InputLabelProps && {InputLabelProps: {shrink: autofilled}})}
      value={value}
      // InputProps={{autocomplete: 'email'}}
      onChange={handleChange}
      error={Boolean(errorMsg) || error}
      helperText={errorMsg || helperText}
      {...rest}
    />
  );
};

export default UsernameTextField;
