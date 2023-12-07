import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {TextField, TextFieldProps} from '@mui/material';
import {defineMessages, useIntl} from 'react-intl';
import {EMAIL_REGEX, USERNAME_REGEX} from '../../constants/Account';

const messages = defineMessages({
  usernameError: {
    id: 'ui.common.error.username',
    defaultMessage: 'ui.common.error.username'
  },
  usernameOrEmail: {
    id: 'ui.common.error.usernameOrEmail',
    defaultMessage: 'ui.common.error.usernameOrEmail'
  }
});

const PREFIX = 'SCUsernameTextField';

const Root = styled(TextField, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export type UsernameTextFieldProps = {
  /**
   * Allows the field to accept an email format as well
   */
  allowEmail?: boolean;
} & TextFieldProps;

const UsernameTextField = (props: UsernameTextFieldProps): JSX.Element => {
  // PROPS
  const {onChange, error = false, allowEmail = false, helperText = null, ...rest} = props;

  // STATE
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      if (
        allowEmail &&
        ((event.target.value.includes('@') && !EMAIL_REGEX.test(event.target.value)) ||
          (!event.target.value.includes('@') && !USERNAME_REGEX.test(event.target.value)))
      ) {
        setErrorMsg(intl.formatMessage(messages.usernameOrEmail));
      } else if (!allowEmail && !USERNAME_REGEX.test(event.target.value)) {
        setErrorMsg(intl.formatMessage(messages.usernameError));
      } else if (error !== null) {
        setErrorMsg(null);
      }
    } else if (error !== null) {
      setErrorMsg(null);
    }
    onChange && onChange(event);
  };

  // RENDER
  return <Root {...rest} onChange={handleChange} error={Boolean(errorMsg) || error} helperText={errorMsg || helperText} />;
};

export default UsernameTextField;
