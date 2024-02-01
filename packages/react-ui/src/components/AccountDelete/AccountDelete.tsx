import React, {useCallback, useMemo, useState} from 'react';
import {useThemeProps} from '@mui/system';
import {styled} from '@mui/material/styles';
import {Box, BoxProps, TextField, Typography} from '@mui/material';
import classNames from 'classnames';
import {UserService} from '@selfcommunity/api-services';
import {Logger} from '@selfcommunity/utils';
import {SCPreferences, SCPreferencesContextType, SCUserContextType, useSCPreferences, useSCUser} from '@selfcommunity/react-core';
import {SCUserType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {FormattedMessage, useIntl} from 'react-intl';
import LoadingButton from '@mui/lab/LoadingButton';

const PREFIX = 'SCAccountDelete';

const classes = {
  root: `${PREFIX}-root`,
  message: `${PREFIX}-message`,
  confirm: `${PREFIX}-confirm`,
  button: `${PREFIX}-button`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

export interface AccountDeleteProps extends BoxProps {
  /**
   * Callback when logout rejecting policy document
   */
  onLogout?: () => void;

  /**
   * Callback when delete account rejecting policy document
   */
  onDeleteAccount?: (user?: SCUserType) => void;

  /**
   * Any other properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS AccountDelete component. Learn about the available props and the CSS API.
 *
 *
 * This component allows users to display the logic behind user deletion.
 * Take a look at our <strong>demo</strong> component [here](/docs/sdk/community-js/react-ui/Components/AccountDelete)

 #### Import
 ```jsx
 import {AccountDelete} from '@selfcommunity/react-ui';
 ```

 #### Component Name
 The name `SCAccountDelete` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAccountDelete-root|Styles applied to the root element.|
 |message|.SCAccountDelete-message|Styles applied to the message element section.|
 |confirm|.SCAccountDelete-confirm|Styles applied to the confirm element section.|
 |button|.SCAccountDelete-button|Styles applied to the button element.|

 * @param inProps
 */
export default function AccountDelete(inProps: AccountDeleteProps): JSX.Element {
  // PROPS
  const props: AccountDeleteProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className = '', onLogout, onDeleteAccount, ...rest} = props;

  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();

  // PREFERENCES
  const scPreferences: SCPreferencesContextType = useSCPreferences();
  const communityName = useMemo(() => {
    return scPreferences.preferences && SCPreferences.TEXT_APPLICATION_NAME in scPreferences.preferences
      ? scPreferences.preferences[SCPreferences.TEXT_APPLICATION_NAME].value
      : null;
  }, [scPreferences.preferences]);

  // STATE
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string>('');

  // CONST
  const authUserId = scUserContext.user ? scUserContext.user.id : null;

  // INTL
  const intl = useIntl();

  /**
   * Handle confirm delete account
   */
  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    setError(null);
    UserService.userDelete(scUserContext.user.id, 0)
      .then(() => {
        setIsDeleting(false);
        onDeleteAccount && onDeleteAccount(scUserContext.user);
        handleLogout();
      })
      .catch((_error) => {
        setError(intl.formatMessage({id: 'ui.common.error.action', defaultMessage: 'ui.common.error.action'}));
        Logger.error(SCOPE_SC_UI, _error);
      })
      .then(() => setIsDeleting(false));
  }, [setIsDeleting, setError, onDeleteAccount]);

  /**
   * Handle logout
   */
  const handleLogout = useCallback(() => {
    scUserContext.logout();
    onLogout && onLogout();
  }, [scUserContext.logout, onLogout]);

  const handleChange = useCallback((event) => setConfirm(event.target.value), [setConfirm]);

  /**
   * If there's no authUserId, component is hidden.
   */
  if (!authUserId) {
    return null;
  }

  /**
   * Renders root object
   */
  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <Typography className={classes.message}>
        <FormattedMessage
          id="ui.accountDelete.message"
          defaultMessage="ui.accountDelete.message"
          values={{
            communityName,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            li: (chunks) => <li>{chunks}</li>,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ul: (chunks) => <ul>{chunks}</ul>
          }}
        />
      </Typography>
      <Typography className={classes.confirm}>
        <FormattedMessage
          id="ui.accountDelete.confirmMessage"
          defaultMessage="ui.accountDelete.confirmMessage"
          values={{
            username: scUserContext.user.username,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            b: (chunks) => <b>{chunks}</b>
          }}
        />
        <TextField name="confirm" value={confirm} onChange={handleChange} autoComplete="off" size="small" />
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <LoadingButton
        className={classes.button}
        size="small"
        disabled={isDeleting || confirm !== scUserContext.user.username}
        variant="outlined"
        onClick={handleDelete}>
        <FormattedMessage id="ui.accountDelete.buttonLabel" defaultMessage="ui.accountDelete.buttonLabel" />
      </LoadingButton>
    </Root>
  );
}
