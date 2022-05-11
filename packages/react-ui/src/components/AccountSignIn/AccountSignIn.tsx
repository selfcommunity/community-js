import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {http, Endpoints, HttpResponse} from '@selfcommunity/api-services';
import {Logger, SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCAuthTokenType} from '@selfcommunity/types';
import {ButtonProps, TextField, TextFieldProps} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {LoadingButton} from '@mui/lab';
import PasswordTextField from '../../shared/PasswordTextField';
import {SCOPE_SC_UI} from '../../constants/Errors';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCAccountSignIn';

const classes = {
  root: `${PREFIX}-root`,
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
  }
}));

export interface AccountSignInProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Callback triggered for handling custom signin process instead of the default one
   * @param username
   * @param password
   * @default null
   */
  onSubmit?: (username: string, password: string) => void;

  /**
   * Callback triggered on success sign in
   * @param user
   * @default null
   */
  onSuccess?: (token: SCAuthTokenType) => void;

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
 * > This component support [OAuth2 authentication](https://developers.selfcommunity.com/docs/api/authentication/oauth#password) protocol with grant_type password

 #### Import

 ```jsx
 import {AccountSignIn} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountSignIn` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountSignIn-root|Styles applied to the root element.|
 |username|.SCAccountSignIn-username|Styles applied to the username TextField.|
 |password|.SCAccountSignIn-password|Styles applied to the password TextField.|

 *
 * @param inProps
 */
export default function AccountSignIn(inProps: AccountSignInProps): JSX.Element {
  const props: AccountSignInProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {
    className,
    onSubmit = null,
    onSuccess = null,
    TextFieldProps = {variant: 'outlined', fullWidth: true},
    ButtonProps = {variant: 'contained'},
    ...rest
  } = props;

  // STATE
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HANDLERS
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSubmitting(true);
    if (onSubmit) {
      onSubmit(username, password);
    } else if (scUserContext.session.clientId) {
      const formData = new FormData();
      formData.append('client_id', scUserContext.session.clientId);
      formData.append('grant_type', 'password');
      formData.append('username', username);
      formData.append('password', password);
      http
        .request({
          url: Endpoints.OAuthToken.url({}),
          method: Endpoints.OAuthToken.method,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        })
        .then((res: HttpResponse<SCAuthTokenType>) => {
          onSuccess && onSuccess(res.data);
          setIsSubmitting(false);
        })
        .catch((error) => {
          setIsSubmitting(false);
          Logger.error(SCOPE_SC_UI, error);
        });
    }
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
      <LoadingButton type="submit" {...ButtonProps} loading={isSubmitting} disabled={!username || !password}>
        <FormattedMessage id="ui.accountSignin.submit" defaultMessage="ui.accountSignin.submit" />
      </LoadingButton>
    </Root>
  );
}
