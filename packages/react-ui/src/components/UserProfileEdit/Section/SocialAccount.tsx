import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import classNames from 'classnames';
import {useThemeProps} from '@mui/system';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import ConfirmDialog from '../../../shared/ConfirmDialog/ConfirmDialog';
import UserSocialAssociation from '../../UserSocialAssociation';
import {UserService} from '@selfcommunity/api-services';
import {SCUserType} from '@selfcommunity/types';
import {SCOPE_SC_UI} from '../../../constants/Errors';
import {Logger} from '@selfcommunity/utils';

const messages = defineMessages({
  socialTitle: {
    id: 'ui.userProfileEditSocialAccount.socialAssociations.title',
    defaultMessage: 'ui.userProfileEditSocialAccount.socialAssociations.title'
  },
  dialogTitleMsg: {
    id: 'ui.userProfileEditSocialAccount.socialAssociations.dialog.msg',
    defaultMessage: 'ui.userProfileEditSocialAccount.socialAssociations.dialog.msg'
  },
  deleteDialogMsg: {
    id: 'ui.userProfileEditSocialAccount.socialAssociations.dialog.msg',
    defaultMessage: 'ui.userProfileEditSocialAccount.socialAssociations.dialog.msg'
  }
});
const PREFIX = 'SCUserProfileEditSectionSocialAccount';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface SocialAccountProps {
  /**
   * The user object
   * @default null
   */
  user: SCUserType;
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * Handles create association callback
   * @param provider
   */
  handleAssociation?: (provider) => void;
  /**
   * Any other properties
   */
  [p: string]: any;
}
export default function SocialAccount(inProps: SocialAccountProps): JSX.Element {
  // PROPS
  const props: SocialAccountProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {user = null, className = null, handleAssociation, ...rest} = props;
  // STATE
  const [provider, setProvider] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);
  // INTL
  const intl = useIntl();

  function handleDelete() {
    const data = {user_id: user.id, provider: provider.provider, ext_id: provider.ext_id};
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

  if (!user) {
    return;
  }

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      <UserSocialAssociation
        children={
          <Typography variant="body1" mb={1} sx={{fontWeight: 'bold'}}>
            {' '}
            {intl.formatMessage(messages.socialTitle)}
          </Typography>
        }
        direction="row"
        userId={user.id}
        onDeleteAssociation={handleOpenDeleteDialog}
        onCreateAssociation={handleAssociation}
        deletingProvider={shouldUpdate ? provider : null}
      />
      {openDeleteDialog && (
        <ConfirmDialog
          open={openDeleteDialog}
          title={intl.formatMessage(messages.dialogTitleMsg, {field: provider.provider})}
          btnConfirm={
            <FormattedMessage
              id="ui.userProfileEditSocialAccount.socialAssociations.dialog.confirm"
              defaultMessage="ui.userProfileEditSocialAccount.socialAssociations.dialog.confirm"
            />
          }
          onConfirm={handleDelete}
          onClose={() => setOpenDeleteDialog(false)}
        />
      )}
    </Root>
  );
}
