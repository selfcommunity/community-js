import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';
import UserSocialAssociation from '../../UserSocialAssociation';
import {UserService} from '@selfcommunity/api-services';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';
import {SCUserContextType, useSCUser} from '@selfcommunity/react-core';
import AccountCredentials, {AccountCredentialProps} from './AccountCredentials';
import AccountDataPortabilityButton from '../../AccountDataPortabilityButton';
import AccountDeleteButton, {AccountDeleteButtonProps} from '../../AccountDeleteButton';
import LanguageSwitcher, {LanguageSwitcherProps} from '../../../shared/LanguageSwitcher';
import {PREFIX} from '../constants';

const messages = defineMessages({
  socialTitle: {
    id: 'ui.userProfileEditAccount.socialAssociations.title',
    defaultMessage: 'ui.userProfileEditAccount.socialAssociations.title'
  },
  dialogTitleMsg: {
    id: 'ui.userProfileEditAccount.socialAssociations.dialog.msg',
    defaultMessage: 'ui.userProfileEditAccount.socialAssociations.dialog.msg'
  },
  deleteDialogMsg: {
    id: 'ui.userProfileEditAccount.socialAssociations.dialog.msg',
    defaultMessage: 'ui.userProfileEditAccount.socialAssociations.dialog.msg'
  }
});

const classes = {
  root: `${PREFIX}-account-root`,
  credentials: `${PREFIX}-credentials`,
  languageSwitcher: `${PREFIX}-language-switcher`,
  dangerZone: `${PREFIX}-danger-zone`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'AccountRoot'
})(() => ({}));

export interface AccountProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles create association callback
   * @param provider
   */
  handleAssociationCreate?: (provider) => void;
  /**
   * If true, shows email and password section
   * @default false
   */
  showCredentialsSection?: boolean;
  /**
   * If true, shows social account section
   * @default true
   */
  showSocialAccountSection?: boolean;
  /**
   * If true, shows language switcher
   * @default false
   */
  showLanguageSwitcher?: boolean;
  /**
   * Props to apply to LanguageSwitcher component
   * @default {}
   */
  LanguageSwitcherProps?: LanguageSwitcherProps;
  /**
   * Actions to be inserted before credentials section
   * @default null
   */
  startActions?: React.ReactNode | null;
  /**
   * Actions to be inserted after social associations section
   * @default null
   */
  endActions?: React.ReactNode | null;
  /**
   * Props to apply to Account credential section
   * @default {}
   */
  AccountCredentialProps?: AccountCredentialProps;
  /**
   * Props to apply to Account delete button
   * @default {}
   */
  AccountDeleteButtonProps?: AccountDeleteButtonProps;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function Account(props: AccountProps): JSX.Element {
  // CONTEXT
  const scUserContext: SCUserContextType = useSCUser();
  // PROPS
  const {
    className = null,
    handleAssociationCreate,
    showSocialAccountSection = true,
    showCredentialsSection = false,
    AccountCredentialProps = {},
    AccountDeleteButtonProps = {},
    showLanguageSwitcher = false,
    LanguageSwitcherProps = {},
    startActions = null,
    endActions = null,
    ...rest
  } = props;
  // STATE
  const [provider, setProvider] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  // INTL
  const intl = useIntl();

  function handleDelete() {
    const data = {user_id: scUserContext.user.id, provider: provider.provider, ext_id: provider.ext_id};
    UserService.deleteProviderAssociation(data)
      .then(() => {
        setShouldUpdate(true);
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        console.log(error);
        Logger.error(SCOPE_SC_UI, error);
      });
  }

  const handleOpenDeleteDialog = (p) => {
    setOpenDeleteDialog(true);
    setProvider(p);
  };

  if (!scUserContext.user) {
    return;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {startActions}
      {showCredentialsSection && <AccountCredentials className={classes.credentials} user={scUserContext?.user} {...AccountCredentialProps} />}
      {showLanguageSwitcher && <LanguageSwitcher className={classes.languageSwitcher} {...LanguageSwitcherProps} />}
      {showSocialAccountSection && (
        <UserSocialAssociation
          children={
            <Typography variant="body1" mb={1} sx={{fontWeight: 'bold'}}>
              {' '}
              {intl.formatMessage(messages.socialTitle)}
            </Typography>
          }
          direction="row"
          userId={scUserContext.user.id}
          onDeleteAssociation={handleOpenDeleteDialog}
          onCreateAssociation={handleAssociationCreate}
          deletingProvider={shouldUpdate ? provider : null}
        />
      )}
      {openDeleteDialog && (
        <ConfirmDialog
          open={openDeleteDialog}
          title={intl.formatMessage(messages.dialogTitleMsg, {field: provider.provider})}
          btnConfirm={
            <FormattedMessage
              id="ui.userProfileEditAccount.socialAssociations.dialog.confirm"
              defaultMessage="ui.userProfileEditAccount.socialAssociations.dialog.confirm"
            />
          }
          onConfirm={handleDelete}
          onClose={() => setOpenDeleteDialog(false)}
        />
      )}
      {endActions}
      <Box className={classes.dangerZone}>
        <AccountDataPortabilityButton fullWidth variant="outlined" color="primary" />
        <AccountDeleteButton fullWidth variant="contained" color="secondary" {...AccountDeleteButtonProps} />
      </Box>
    </Root>
  );
}
