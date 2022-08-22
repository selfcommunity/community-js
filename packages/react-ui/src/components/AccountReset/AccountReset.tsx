import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {Button, ButtonProps, TextFieldProps, Typography} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {AccountService, formatHttpError} from '@selfcommunity/api-services';
import PasswordTextField from '../../shared/PasswordTextField';

const PREFIX = 'SCAccountReset';

const classes = {
  root: `${PREFIX}-root`,
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

export interface AccountResetProps {
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
   * Validation code sent by email to the user
   * @default empty string
   */
  validationCode: string;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS AccountVerify component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AccountVerify} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountReset` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountReset-root|Styles applied to the root element.|
 |email|.SCAccountReset-password|Styles applied to the password TextField.|

 *
 * @param inProps
 */
export default function AccountReset(inProps: AccountResetProps): JSX.Element {
  const props: AccountResetProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {
    className,
    onSuccess = null,
    TextFieldProps = {variant: 'outlined', fullWidth: true},
    ButtonProps = {variant: 'contained'},
    validationCode,
    ...rest
  } = props;

  // STATE
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [validationCodeError, setValidationCodeError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSubmitting(true);

    AccountService.reset({validation_code: validationCode, password})
      .then((res) => onSuccess && onSuccess(null))
      .catch((error) => {
        const _error = formatHttpError(error);
        console.log(_error);
        if (_error.passwordError) {
          setPasswordError(_error.passwordError.error);
        }
        if (_error.validationCodeError) {
          setValidationCodeError(_error.validationCodeError.error);
        }
      })
      .then(() => setIsSubmitting(false));

    return false;
  };

  if (scUserContext.user !== null) {
    // User already logged in
    return null;
  }

  // RENDER
  return (
    <Root className={classNames(classes.root, className)} {...rest} onSubmit={handleSubmit}>
      {validationCodeError ? (
        <Typography color="error">
          <FormattedMessage id="ui.accountReset.code.error" defaultMessage="ui.accountReset.code.error" />
        </Typography>
      ) : (
        <>
          <PasswordTextField
            className={classes.password}
            disabled={isSubmitting}
            label={<FormattedMessage id="ui.accountReset.password.label" defaultMessage="ui.accountReset.password.label" />}
            {...TextFieldProps}
            value={password}
            onChange={handleChange}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <Button type="submit" {...ButtonProps} disabled={!password || isSubmitting}>
            <FormattedMessage id="ui.accountReset.submit" defaultMessage="ui.accountReset.submit" />
          </Button>
        </>
      )}
    </Root>
  );
}
