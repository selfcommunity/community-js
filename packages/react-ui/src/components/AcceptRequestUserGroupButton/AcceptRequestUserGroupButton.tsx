import {Button, styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {GroupService} from '@selfcommunity/api-services';
import {useSCFetchGroup, useSCFetchUser} from '@selfcommunity/react-core';
import {SCGroupType, SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import {HTMLAttributes, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {useSnackbar} from 'notistack';
import {SCGroupEventType, SCTopicType} from '../../constants/PubSub';
import PubSub from 'pubsub-js';

const PREFIX = 'SCAcceptRequestUserEventButton';

const classes = {
  root: `${PREFIX}-root`
};

const AcceptButton = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface AcceptRequestUserGroupButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: HTMLAttributes<HTMLButtonElement>['className'];

  /**
   * Id of the group
   * @default null
   */
  groupId?: number;

  /**
   * Group
   * @default null
   */
  group?: SCGroupType;

  /**
   * Id of the user
   * @default null
   */
  userId?: number;

  /**
   * Group
   * @default null
   */
  user?: SCUserType;

  /**
   * Callback when user accept request
   * @default null
   */
  handleConfirm?: ((id: number | null) => void) | null;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Accept Request User Group Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AcceptRequestUserGroupButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAcceptRequestUserEventButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAcceptRequestUserGroupButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function AcceptRequestUserGroupButton(inProps: AcceptRequestUserGroupButtonProps): JSX.Element {
  // PROPS
  const props: AcceptRequestUserGroupButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, groupId, group, userId, user, handleConfirm = null, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // HOOKS
  const {scGroup} = useSCFetchGroup({id: groupId, group});
  const {scUser} = useSCFetchUser({id: userId, user});
  const {enqueueSnackbar} = useSnackbar();

  /**
   * Notify UI when a member is added to a group
   * @param group
   * @param user
   */
  function notifyChanges(group: SCGroupType, user: SCUserType) {
    if (group && user) {
      PubSub.publish(`${SCTopicType.GROUP}.${SCGroupEventType.ADD_MEMBER}`, {group, user});
    }
  }

  const handleConfirmAction = useCallback(() => {
    setLoading(true);
    GroupService.inviteOrAcceptGroupRequest(scGroup.id, {users: [scUser.id]})
      .then(() => {
        if (handleConfirm) {
          handleConfirm(scUser.id);
        } else {
          enqueueSnackbar(
            <FormattedMessage
              id="ui.acceptRequestUserGroupButton.snackbar.success"
              defaultMessage="ui.acceptRequestUserGroupButton.snackbar.success"
            />,
            {
              variant: 'error',
              autoHideDuration: 3000
            }
          );
        }
        notifyChanges(scGroup, scUser);
        setLoading(false);
        setOpenDialog(false);
      })
      .catch((error) => {
        if (handleConfirm) {
          handleConfirm(null);
        } else {
          enqueueSnackbar(<FormattedMessage id="ui.common.error.action" defaultMessage="ui.common.error.action" />, {
            variant: 'error',
            autoHideDuration: 3000
          });
        }
        Logger.error(SCOPE_SC_UI, error);
      });
  }, [scGroup, scUser]);

  return (
    <>
      <AcceptButton
        size="small"
        variant="outlined"
        onClick={() => setOpenDialog(true)}
        loading={loading}
        className={classNames(classes.root, className)}
        {...rest}>
        <FormattedMessage defaultMessage="ui.acceptRequestUserGroupButton.accept" id="ui.acceptRequestUserGroupButton.accept" />
      </AcceptButton>

      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          title={<FormattedMessage id="ui.acceptRequestUserGroupButton.dialog.title" defaultMessage="ui.acceptRequestUserGroupButton.dialog.title" />}
          content={<FormattedMessage id="ui.acceptRequestUserGroupButton.dialog.msg" defaultMessage="ui.acceptRequestUserGroupButton.dialog.msg" />}
          btnConfirm={
            <FormattedMessage id="ui.acceptRequestUserGroupButton.dialog.confirm" defaultMessage="ui.acceptRequestUserGroupButton.dialog.confirm" />
          }
          isUpdating={loading}
          onConfirm={handleConfirmAction}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
}
