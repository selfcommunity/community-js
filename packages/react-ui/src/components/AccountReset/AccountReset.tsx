import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {Alert, Box, Button, ButtonProps, TextFieldProps, Typography} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage, useIntl} from 'react-intl';
import {useThemeProps} from '@mui/system';
import {AccountService, formatHttpErrorCode} from '@selfcommunity/api-services';
import PasswordTextField from '../../shared/PasswordTextField';

const PREFIX = 'SCAccountReset';

const classes = {
  root: `${PREFIX}-root`,
  form: `${PREFIX}-form`,
  password: `${PREFIX}-password`,
  success: `${PREFIX}-success`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.form} .MuiTextField-root, &.${classes.root} .MuiButton-root`]: {
    margin: theme.spacing(1, 0, 1, 0)
  },
  [`& .${classes.form} .MuiTypography-root`]: {
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
   * Callback triggered on success sign in
   * @default null
   */
  onSuccess?: (res: any) => void;

  /**
   * Action component to display after success message
   * */
  successAction?: React.ReactNode;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Account Reset component. Learn about the available props and the CSS API.
 * <br/>This component allows users to log in to the application with their usernames and passwords.
 * <br/>Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/AccountReset)

 #### Import

 ```jsx
 import {AccountReset} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountReset` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountReset-root|Styles applied to the root element.|
 |form|.SCAccountReset-form|Styles applied to the form element.|
 |email|.SCAccountReset-password|Styles applied to the password TextField.|
 |success|.SCAccountRecover-success|Styles applied to the success Alert.|
 |error|.SCAccountRecover-error|Styles applied to the error Alert.|

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
    successAction = null,
    ...rest
  } = props;

  // STATE
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [validationCodeError, setValidationCodeError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSucceed, setIsSucceed] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const intl = useIntl();

  // HANDLERS
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSubmitting(true);

    AccountService.reset({validation_code: validationCode, password})
      .then((res: any) => {
        setIsSucceed(true);
        onSuccess && onSuccess(res);
      })
      .catch((error) => {
        const _error = formatHttpErrorCode(error);
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
    <Root className={classNames(classes.root, className)} {...rest}>
      {isSucceed ? (
        <Alert severity="success" className={classes.success}>
          {intl.formatMessage({id: 'ui.accountReset.success', defaultMessage: 'ui.accountReset.success'})}
          {successAction}
        </Alert>
      ) : validationCodeError ? (
        <Alert severity="error" className={classes.error}>
          <FormattedMessage id="ui.accountReset.code.error" defaultMessage="ui.accountReset.code.error" />
        </Alert>
      ) : (
        <form className={classes.form} onSubmit={handleSubmit}>
          <PasswordTextField
            className={classes.password}
            disabled={isSubmitting}
            label={<FormattedMessage id="ui.accountReset.password.label" defaultMessage="ui.accountReset.password.label" />}
            {...TextFieldProps}
            value={password}
            onChange={handleChange}
            error={Boolean(passwordError)}
            helperText={
              passwordError && (
                <FormattedMessage
                  id={`ui.accountReset.password.error.${passwordError}`}
                  defaultMessage={`ui.accountReset.password.error.${passwordError}`}
                />
              )
            }
          />
          <Button type="submit" {...ButtonProps} disabled={!password || isSubmitting}>
            <FormattedMessage id="ui.accountReset.submit" defaultMessage="ui.accountReset.submit" />
          </Button>
        </form>
      )}
    </Root>
  );
}
