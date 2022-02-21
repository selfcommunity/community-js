import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Link, SCRoutes, SCRoutingContextType, SCUserContextType, SCUserType, useSCRouting, useSCUser} from '@selfcommunity/core';
import {ButtonProps, Divider, TextField, TextFieldProps, Typography} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import PasswordTextField from '../../shared/PasswordTextField';

const PREFIX = 'SCSignIn';

const classes = {
  root: `${PREFIX}-root`,
  username: `${PREFIX}-username`,
  password: `${PREFIX}-password`,
  recover: `${PREFIX}-recover`,
  signUp: `${PREFIX}-signUp`
};

const Root = styled('form', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`&.${classes.root} .MuiTextField-root, &.SCSignIn-root .MuiButton-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  },
  [`&.${classes.root} .MuiTypography-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  }
}));

export interface SignInProps {
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
 * > API documentation for the Community-UI SignIn component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {SignIn} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCSignIn` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCSignIn-root|Styles applied to the root element.|
 |username|.SCSignIn-username|Styles applied to the username TextField.|
 |password|.SCSignIn-password|Styles applied to the password TextField.|
 |recover|.SCSignIn-recover|Styles applied to the recover element.|
 |signUp|.SCSignIn-signUp|Styles applied to the signUp element.|

 *
 * @param props
 */
export default function SignIn(props: SignInProps): JSX.Element {
  // PROPS
  const {className, onSuccess = null, TextFieldProps = {variant: 'outlined', fullWidth: true}, ButtonProps = {variant: 'contained'}, ...rest} = props;

  // STATE
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HANDLERS
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSubmitting(true);

    // TODO: signin API call
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
        className={classes.username}
        label={<FormattedMessage id="ui.signIn.username.label" defaultMessage="ui.signIn.username.label" />}
        {...TextFieldProps}
        value={username}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
      />
      <PasswordTextField
        className={classes.password}
        label={<FormattedMessage id="ui.signIn.password.label" defaultMessage="ui.signIn.password.label" />}
        {...TextFieldProps}
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
      />
      <LoadingButton type="submit" {...ButtonProps} loading={isSubmitting}>
        <FormattedMessage id="ui.signIn.submit" defaultMessage="ui.signIn.submit" />
      </LoadingButton>
      <Typography variant="body2" className={classes.recover}>
        <Link to={scRoutingContext.url(SCRoutes.RECOVER_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.signIn.recover" defaultMessage="ui.signIn.recover" />
        </Link>
      </Typography>
      <Divider />
      <Typography variant="body2" className={classes.signUp}>
        <Link to={scRoutingContext.url(SCRoutes.SIGNUP_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.signIn.signUp" defaultMessage="ui.signIn.signUp" />
        </Link>
      </Typography>
    </Root>
  );
}
