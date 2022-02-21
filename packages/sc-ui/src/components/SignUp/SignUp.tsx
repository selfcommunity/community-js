import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Link, SCRoutes, SCRoutingContextType, SCUserContextType, SCUserType, useSCRouting, useSCUser} from '@selfcommunity/core';
import {ButtonProps, Divider, TextField, TextFieldProps, Typography} from '@mui/material';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import PasswordTextField from '../../shared/PasswordTextField';

const messages = defineMessages({
  emailError: {
    id: 'ui.common.error.email',
    defaultMessage: 'ui.common.error.email'
  },
  usernameError: {
    id: 'ui.common.error.username',
    defaultMessage: 'ui.common.error.username'
  }
});

const PREFIX = 'SCSignUp';

const classes = {
  root: `${PREFIX}-root`,
  email: `${PREFIX}-email`,
  username: `${PREFIX}-username`,
  password: `${PREFIX}-password`,
  signUp: `${PREFIX}-signUp`
};

const Root = styled('form', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`&.${classes.root} .MuiTextField-root, &.SCSignUp-root .MuiButton-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  },
  [`&.${classes.root} .MuiTypography-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  }
}));

export interface SignUpProps {
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
 * > API documentation for the Community-UI SignUp component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SignUp} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCSignUp` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSignUp-root|Styles applied to the root element.|
 |email|.SCSignUp-email|Styles applied to the email TextField.|
 |username|.SCSignUp-username|Styles applied to the username TextField.|
 |password|.SCSignUp-password|Styles applied to the password TextField.|
 |signUp|.SCSignUp-signUp|Styles applied to the signUp element.|

 *
 * @param props
 */
export default function SignUp(props: SignUpProps): JSX.Element {
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
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HOOKS
  const intl = useIntl();

  // HANDLERS
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        event.target.value
      )
    ) {
      setEmailError(intl.formatMessage(messages.emailError));
    } else if (usernameError !== null) {
      setEmailError(null);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    if (!/^[_-]*[a-zA-Z0-9]+[a-zA-Z0-9_-]*$/.test(event.target.value)) {
      setUsernameError(intl.formatMessage(messages.usernameError));
    } else if (usernameError !== null) {
      setUsernameError(null);
    }
  };

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
      <TextField
        className={classes.email}
        label={<FormattedMessage id="ui.signUp.email.label" defaultMessage="ui.signUp.email.label" />}
        {...TextFieldProps}
        error={Boolean(emailError)}
        helperText={emailError}
        value={email}
        onChange={handleEmailChange}
      />
      <TextField
        className={classes.username}
        label={<FormattedMessage id="ui.signUp.username.label" defaultMessage="ui.signUp.username.label" />}
        {...TextFieldProps}
        error={Boolean(usernameError)}
        helperText={usernameError}
        value={username}
        onChange={handleUsernameChange}
      />
      <PasswordTextField
        className={classes.password}
        label={<FormattedMessage id="ui.signUp.password.label" defaultMessage="ui.signUp.password.label" />}
        {...TextFieldProps}
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
      />
      <LoadingButton type="submit" {...ButtonProps} loading={isSubmitting}>
        <FormattedMessage id="ui.signUp.submit" defaultMessage="ui.signUp.submit" />
      </LoadingButton>
      <Typography variant="body2" className={classes.signUp}>
        <Link to={scRoutingContext.url(SCRoutes.SIGNIN_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.signUp.signUp" defaultMessage="ui.signUp.signUp" />
        </Link>
      </Typography>
    </Root>
  );
}
