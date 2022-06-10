import React, {ChangeEvent, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {Button, ButtonProps, TextFieldProps} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PasswordTextField from '../../shared/PasswordTextField';
import EmailTextField from '../../shared/EmailTextField';
import UsernameTextField from '../../shared/UsernameTextField';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCAccountSignUp';

const classes = {
  root: `${PREFIX}-root`,
  email: `${PREFIX}-email`,
  username: `${PREFIX}-username`,
  password: `${PREFIX}-password`
};

const Root = styled('form', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`&.${classes.root} .MuiTextField-root, &.${classes.root} .MuiButton-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  },
  [`&.${classes.root} .MuiTypography-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  }
}));

export interface AccountSignUpProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Callback triggered on success sign in
   * @default null
   */
  onSuccess?: (user: SCUserType) => void;

  /**
   * Default props to TextField Input
   * @default {variant: 'outlined'}
   */
  TextFieldProps?: TextFieldProps;

  /**
   * Default props to submit button Input
   * @default {variant: 'contained'}
   */
  ButtonProps?: ButtonProps;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS AccountSignUp component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AccountSignUp} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountSignUp` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountSignUp-root|Styles applied to the root element.|
 |email|.SCAccountSignUp-email|Styles applied to the email TextField.|
 |username|.SCAccountSignUp-username|Styles applied to the username TextField.|
 |password|.SCAccountSignUp-password|Styles applied to the password TextField.|

 *
 * @param inProps
 */
export default function AccountSignUp(inProps: AccountSignUpProps): JSX.Element {
  const props: AccountSignUpProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // PROPS
  const {className, onSuccess = null, TextFieldProps = {variant: 'outlined', fullWidth: true}, ButtonProps = {variant: 'contained'}, ...rest} = props;

  // STATE
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HANDLERS
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSubmitting(true);

    // TODO: signup API call
    onSuccess && onSuccess(null);

    return false;
  };

  if (scUserContext.user !== null) {
    // User already logged in
    return null;
  }

  // RENDER
  return (
    <Root className={classNames(classes.root, className)} {...rest} onSubmit={handleSubmit}>
      <EmailTextField
        className={classes.email}
        label={<FormattedMessage id="ui.accountSignup.email.label" defaultMessage="ui.accountSignup.email.label" />}
        {...TextFieldProps}
        error={Boolean(emailError)}
        helperText={emailError}
        value={email}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
      />
      <UsernameTextField
        className={classes.username}
        label={<FormattedMessage id="ui.accountSignup.username.label" defaultMessage="ui.accountSignup.username.label" />}
        {...TextFieldProps}
        error={Boolean(usernameError)}
        helperText={usernameError}
        value={username}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
      />
      <PasswordTextField
        className={classes.password}
        label={<FormattedMessage id="ui.accountSignup.password.label" defaultMessage="ui.accountSignup.password.label" />}
        {...TextFieldProps}
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
      />
      <Button type="submit" {...ButtonProps} disabled={!email || !username || !password || isSubmitting}>
        <FormattedMessage id="ui.accountSignup.submit" defaultMessage="ui.accountSignup.submit" />
      </Button>
    </Root>
  );
}
