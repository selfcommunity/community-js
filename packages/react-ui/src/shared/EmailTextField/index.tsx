import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {TextField, TextFieldProps} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {EMAIL_REGEX} from '../../constants/Account';
import useInitialAutofilledInput from '../../utils/autofilledInput';

const messages = defineMessages({
  emailError: {
    id: 'ui.common.error.email',
    defaultMessage: 'ui.common.error.email'
  }
});

const PREFIX = 'SCEmailTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export default function PasswordTextField(props: TextFieldProps): JSX.Element {
  // PROPS
  const {id, value = '', onChange, InputLabelProps = {}, error = false, helperText = null, ...rest} = props;

  // STATE
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // HOOKS
  const intl = useIntl();
  const {autofilled, setAutofilledInitialized} = useInitialAutofilledInput(id, value);

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value && !EMAIL_REGEX.test(event.target.value)) {
      setErrorMsg(intl.formatMessage(messages.emailError));
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
      onChange={handleChange}
      error={Boolean(errorMsg) || error}
      helperText={errorMsg || helperText}
      {...rest}
    />
  );
}
