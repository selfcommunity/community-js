import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Link, SCRoutes, SCRoutingContextType, SCUserContextType, SCUserType, useSCRouting, useSCUser} from '@selfcommunity/core';
import {ButtonProps, Divider, TextField, TextFieldProps, Typography} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import PasswordTextField from '../../shared/PasswordTextField';

const PREFIX = 'SCAccountSignIn';

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
  [`&.${classes.root} .MuiTextField-root, &.${classes.root} .MuiButton-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  },
  [`&.${classes.root} .MuiTypography-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  }
}));

export interface AccountSignInProps {
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
 * > API documentation for the Community-UI AccountSignIn component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AccountSignIn} from '@selfcommunity/ui';
 ```

 #### Component Name

 The name `SCAccountSignIn` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountSignIn-root|Styles applied to the root element.|
 |username|.SCAccountSignIn-username|Styles applied to the username TextField.|
 |password|.SCAccountSignIn-password|Styles applied to the password TextField.|
 |recover|.SCAccountSignIn-recover|Styles applied to the recover element.|
 |signUp|.SCAccountSignIn-signUp|Styles applied to the signUp element.|

 *
 * @param props
 */
export default function AccountSignIn(props: AccountSignInProps): JSX.Element {
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
        label={<FormattedMessage id="ui.accountSignin.username.label" defaultMessage="ui.accountSignin.username.label" />}
        {...TextFieldProps}
        value={username}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
      />
      <PasswordTextField
        className={classes.password}
        label={<FormattedMessage id="ui.accountSignin.password.label" defaultMessage="ui.accountSignin.password.label" />}
        {...TextFieldProps}
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
      />
      <LoadingButton type="submit" {...ButtonProps} loading={isSubmitting}>
        <FormattedMessage id="ui.accountSignin.submit" defaultMessage="ui.accountSignin.submit" />
      </LoadingButton>
      <Typography variant="body2" className={classes.recover}>
        <Link to={scRoutingContext.url(SCRoutes.RECOVER_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.accountSignin.recover" defaultMessage="ui.accountSignin.recover" />
        </Link>
      </Typography>
      <Divider />
      <Typography variant="body2" className={classes.signUp}>
        <Link to={scRoutingContext.url(SCRoutes.SIGNUP_ROUTE_NAME, {})}>
          <FormattedMessage id="ui.accountSignin.signUp" defaultMessage="ui.accountSignin.signUp" />
        </Link>
      </Typography>
    </Root>
  );
}
