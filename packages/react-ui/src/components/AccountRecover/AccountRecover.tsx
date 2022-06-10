import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCRoutingContextType, SCUserContextType, useSCRouting, useSCUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {Button, ButtonProps, TextFieldProps} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import EmailTextField from '../../shared/EmailTextField';
import {useThemeProps} from '@mui/system';

const PREFIX = 'SCAccountRecover';

const classes = {
  root: `${PREFIX}-root`,
  email: `${PREFIX}-email`
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

export interface AccountRecoverProps {
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
 * > API documentation for the Community-JS AccountRecover component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AccountRecover} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountRecover` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountRecover-root|Styles applied to the root element.|
 |email|.SCAccountRecover-email|Styles applied to the email TextField.|

 *
 * @param inProps
 */
export default function AccountRecover(inProps: AccountRecoverProps): JSX.Element {
  const props: AccountRecoverProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // PROPS
  const {className, onSuccess = null, TextFieldProps = {variant: 'outlined', fullWidth: true}, ButtonProps = {variant: 'contained'}, ...rest} = props;

  // STATE
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  const scRoutingContext: SCRoutingContextType = useSCRouting();

  // HANDLERS
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSubmitting(true);

    // TODO: recover API call
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
        label={<FormattedMessage id="ui.accountRecover.email.label" defaultMessage="ui.accountRecover.email.label" />}
        {...TextFieldProps}
        value={email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        error={Boolean(emailError)}
        helperText={emailError}
      />
      <Button type="submit" {...ButtonProps} disabled={!email || isSubmitting}>
        <FormattedMessage id="ui.accountRecover.submit" defaultMessage="ui.accountRecover.submit" />
      </Button>
    </Root>
  );
}
