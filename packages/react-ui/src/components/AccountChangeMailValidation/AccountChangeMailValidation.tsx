import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import {Alert, Box, CircularProgress} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {UserService} from '@selfcommunity/api-services';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCAccountChangeMailValidation';

const classes = {
  root: `${PREFIX}-root`,
  success: `${PREFIX}-success`,
  error: `${PREFIX}-error`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export interface AccountChangeMailValidationProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Validation code sent by email to the user
   * @default empty string
   */
  validationCode: string;

  /**
   * Id (userId) sent by email to the user
   * @default null
   */
  userId: number;

  /**
   * New email sent by email to the user
   * @default null
   */
  newEmail: string;

  /**
   * Callback triggered on success
   * @default null
   */
  onSuccess?: (res: any) => void;

  /**
   * Action component to display after success message
   * */
  successAction?: React.ReactNode;

  /**
   * Callback triggered on error
   * @default null
   */
  onError?: (res: any) => void;

  /**
   * Action component to display after error message
   * */
  errorAction?: React.ReactNode;

  /**
   * Other props
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS AccountChangeMailValidation component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AccountChangeMailValidation} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAccountChangeMailValidation` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountChangeMailValidation-root|Styles applied to the root element.|
 |success|.SCAccountChangeMailValidation-success|Styles applied to the success Alert.|
 |error|.SCAccountChangeMailValidation-error|Styles applied to the error Alert.|

 *
 * @param inProps
 */
export default function AccountChangeMailValidation(inProps: AccountChangeMailValidationProps): JSX.Element {
  const props: AccountChangeMailValidationProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  // PROPS
  const {className, onSuccess, onError, validationCode, userId, newEmail, successAction = null, errorAction = null, ...rest} = props;

  // STATE
  const [succeed, setSucceed] = useState<boolean | string>(false);
  const [error, setError] = useState<boolean>(false);

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // EFFECTS
  useEffect(() => {
    if (scUserContext.user === undefined || !validationCode || !newEmail || isNaN(userId) || succeed) {
      return;
    }
    setError(false);
    UserService.confirmChangeUserMail(userId, newEmail, validationCode)
      .then((res) => {
        setSucceed(true);
        onSuccess && onSuccess(res);
      })
      .catch((error) => {
        setError(true);
        onError && onError(error);
      });
  }, [validationCode, userId, newEmail, scUserContext.user, succeed]);

  if (scUserContext.user === undefined) {
    return null;
  }

  // RENDER
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {succeed ? (
        <Alert severity="success" className={classes.success}>
          {typeof succeed === 'string' ? (
            succeed
          ) : (
            <FormattedMessage id="ui.accountChangeMailValidation.success" defaultMessage="ui.accountChangeMailValidation.success" />
          )}
          {successAction}
        </Alert>
      ) : error ? (
        <Alert severity="error" className={classes.error}>
          <FormattedMessage id="ui.accountChangeMailValidation.error" defaultMessage="ui.accountChangeMailValidation.error" />
          {errorAction}
        </Alert>
      ) : (
        <>
          <CircularProgress />
          <FormattedMessage id="ui.accountChangeMailValidation.verifying" defaultMessage="ui.accountChangeMailValidation.verifying" />
        </>
      )}
    </Root>
  );
}
