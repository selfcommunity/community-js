import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Button, CircularProgress, FormGroup, IconButton, InputAdornment, Popover, Typography} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {formatHttpErrorCode, UserService} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import BaseDialog from '../../../shared/BaseDialog';
import PasswordTextField from '../../../shared/PasswordTextField';
import EmailTextField from '../../../shared/EmailTextField';
import {SCUserChangeEmailType, SCUserType} from '@selfcommunity/types';
import {LoadingButton} from '@mui/lab';
import Icon from '@mui/material/Icon';
import {useSnackbar} from 'notistack';

const messages = defineMessages({
  changePasswordTitle: {
    id: 'ui.userProfileEditAccountCredentials.changePassword',
    defaultMessage: 'ui.userProfileEditAccountCredentials.changePassword'
  },
  confirmPasswordError: {
    id: 'ui.userProfileEditAccountCredentials.confirmPassword.error',
    defaultMessage: 'ui.userProfileEditAccountCredentials.confirmPassword.error'
  }
});
const PREFIX = 'SCUserProfileEditSectionAccountCredentials';

const classes = {
  root: `${PREFIX}-root`,
  email: `${PREFIX}-email`,
  success: `${PREFIX}-success`,
  error: `${PREFIX}-error`,
  dangerZone: `${PREFIX}-danger-zone`,
  dialogRoot: `${PREFIX}-dialog-root`,
  form: `${PREFIX}-password-form`,
  formField: `${PREFIX}-form-field`,
  password: `${PREFIX}-password`,
  confirmChangeButton: `${PREFIX}-confirm-change-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

const PasswordDialogRoot = styled(BaseDialog, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.dialogRoot
})(() => ({}));

export interface AccountCredentialProps {
  /**
   * The user obj
   */
  user?: SCUserType;

  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;

  /**
   * Skip email validation when change email
   * @default false
   */
  skipEmailValidation?: boolean;

  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function AccountCredentials(inProps: AccountCredentialProps): JSX.Element {
  // PROPS
  const props: AccountCredentialProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  // CONTEXT
  const {className = null, user, skipEmailValidation = false, ...rest} = props;
  // STATE
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState<boolean>(false);
  const initialFieldState = {
    email: user?.email ?? '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  };
  const initialErrorState = {
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  };
  const [field, setField] = useState<any>(initialFieldState);
  const [error, setError] = useState<any>(initialErrorState);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const {enqueueSnackbar} = useSnackbar();
  // INTL
  const intl = useIntl();

  // HANDLERS
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    setField((prev) => ({...prev, [name]: value}));
    if (!value) {
      setError((prev) => ({...prev, [name]: value}));
    } else {
      setError((prev) => ({...prev, [name]: ''}));
    }
  };
  const handleEmailBlur = (e) => {
    if (!e.target.value) {
      setField((prev) => ({...prev, ['email']: user?.email}));
      setIsEditing(false);
    }
  };
  const validateInput = () => {
    if (field.newPassword !== field.confirmPassword) {
      setError((prev) => ({...prev, ['confirmPassword']: intl.formatMessage(messages.confirmPasswordError)}));
    }
  };

  const handleCloseDialog = () => {
    setOpenChangePasswordDialog(false);
    setField(initialFieldState);
    setError(initialErrorState);
  };

  const handleSubmitPassword = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSubmittingPassword(true);
    UserService.changeUserPassword(user?.id, field.password, field.newPassword)
      .then(() => {
        setIsSubmittingPassword(false);
        handleCloseDialog();
      })
      .catch((error) => {
        setIsSubmittingPassword(false);
        const _error = formatHttpErrorCode(error);
        Logger.error(SCOPE_SC_UI, error);
        if (_error.passwordError) {
          setError((prev) => ({...prev, ['password']: _error.passwordError.error}));
        }
        if (_error.newPasswordError) {
          setError((prev) => ({...prev, ['newPassword']: _error.newPasswordError.error}));
        }
      });
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    UserService.changeUserMail(user?.id, field.email, skipEmailValidation ? false : true)
      .then((res: SCUserChangeEmailType) => {
        setIsEditing(false);
        setIsSubmitting(false);
      })
      .catch((error) => {
        setIsSubmitting(false);
        const _error = formatHttpErrorCode(error);
        setError((prev) => ({...prev, ['email']: _error.newEmailError ? `newEmailError.${_error.newEmailError.error}` : _error.error}));
      });
  };

  if (!user) {
    return;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <>
        <Typography variant="body1" className={classes.email}>
          <FormattedMessage id="ui.userProfileEditAccountCredentials.email" defaultMessage="ui.userProfileEditAccountCredentials.email" />
        </Typography>
        <>
          {isSubmitting ? (
            <CircularProgress />
          ) : (
            <>
              <EmailTextField
                name="email"
                disabled={!isEditing || isSubmitting}
                size="small"
                value={field.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                error={Boolean(error.email)}
                helperText={
                  error.email && (
                    <FormattedMessage
                      id={`ui.userProfileEditAccountCredentials.email.error.${error.email}`}
                      defaultMessage={`ui.userProfileEditAccountCredentials.email.error.${error.email}`}
                    />
                  )
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {!isEditing ? (
                        <IconButton onClick={() => setIsEditing(true)} edge="end">
                          <Icon>edit</Icon>
                        </IconButton>
                      ) : error.email ? (
                        <Icon color="error">error</Icon>
                      ) : (
                        <IconButton onClick={handleSubmitEmail} edge="end" color="primary" disabled={!field.email || error.email}>
                          <Icon>check</Icon>
                        </IconButton>
                      )}
                    </InputAdornment>
                  )
                }}
              />
            </>
          )}
        </>
        <Typography variant="body1" className={classes.password}>
          <FormattedMessage
            id="ui.userProfileEditAccountCredentials.passwordLabel"
            defaultMessage="ui.userProfileEditAccountCredentials.passwordLabel"
          />
        </Typography>
        <Button size="small" variant="outlined" onClick={() => setOpenChangePasswordDialog(true)} sx={{mb: 1}}>
          <FormattedMessage
            id="ui.userProfileEditAccountCredentials.changePassword"
            defaultMessage="ui.userProfileEditAccountCredentials.changePassword"
          />
        </Button>
      </>
      {openChangePasswordDialog && (
        <PasswordDialogRoot
          className={classes.dialogRoot}
          title={intl.formatMessage(messages.changePasswordTitle)}
          open={openChangePasswordDialog}
          onClose={handleCloseDialog}
          {...rest}>
          <FormGroup className={classes.form}>
            <PasswordTextField
              className={classes.formField}
              name="password"
              disabled={isSubmittingPassword}
              label={
                <FormattedMessage id="ui.userProfileEditAccountCredentials.password" defaultMessage="ui.userProfileEditAccountCredentials.password" />
              }
              size="medium"
              value={field.password}
              onChange={handleChange}
              error={Boolean(error.password)}
              helperText={
                error.password && (
                  <FormattedMessage
                    id={`ui.userProfileEditAccountCredentials.password.error.${error.password}`}
                    defaultMessage={`ui.userProfileEditAccountCredentials.password.error.${error.password}`}
                  />
                )
              }
            />
            <PasswordTextField
              name="newPassword"
              className={classes.formField}
              disabled={isSubmittingPassword}
              label={
                <FormattedMessage
                  id="ui.userProfileEditAccountCredentials.newPassword"
                  defaultMessage="ui.userProfileEditAccountCredentials.newPassword"
                />
              }
              size="medium"
              value={field.newPassword}
              onChange={handleChange}
              error={Boolean(error.newPassword)}
              helperText={
                error.newPassword && (
                  <FormattedMessage
                    id={`ui.userProfileEditAccountCredentials.newPassword.error.${error.newPassword}`}
                    defaultMessage={`ui.userProfileEditAccountCredentials.newPassword.error.${error.newPassword}`}
                  />
                )
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="info" onClick={handlePopoverOpen} edge="end">
                      {<Icon>info</Icon>}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Popover
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'right'
              }}
              onClose={handlePopoverClose}>
              <Box sx={{p: '10px'}}>
                <Typography component={'span'} sx={{whiteSpace: 'pre-line'}}>
                  <FormattedMessage
                    id="ui.userProfileEditAccountCredentials.newPassword.info"
                    defaultMessage="ui.userProfileEditAccountCredentials.newPassword.info"
                  />
                </Typography>
              </Box>
            </Popover>
            <PasswordTextField
              name="confirmPassword"
              className={classes.formField}
              disabled={isSubmittingPassword}
              label={
                <FormattedMessage
                  id="ui.userProfileEditAccountCredentials.confirmPassword"
                  defaultMessage="ui.userProfileEditAccountCredentials.confirmPassword"
                />
              }
              size="medium"
              value={field.confirmPassword}
              onChange={handleChange}
              onBlur={validateInput}
              error={Boolean(error.confirmPassword)}
              helperText={error.confirmPassword}
            />
          </FormGroup>
          <LoadingButton
            className={classes.confirmChangeButton}
            loading={isSubmittingPassword}
            disabled={!field.confirmPassword || Boolean(error.confirmPassword) || Boolean(error.password) || Boolean(error.newPassword)}
            variant="contained"
            onClick={handleSubmitPassword}>
            <FormattedMessage
              id="ui.userProfileEditAccountCredentials.changePassword"
              defaultMessage="ui.userProfileEditAccountCredentials.changePassword"
            />
          </LoadingButton>
        </PasswordDialogRoot>
      )}
    </Root>
  );
}
