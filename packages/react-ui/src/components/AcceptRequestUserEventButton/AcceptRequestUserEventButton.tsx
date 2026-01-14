import {LoadingButton} from '@mui/lab';
import {styled} from '@mui/material';
import {useThemeProps} from '@mui/system';
import {EventService} from '@selfcommunity/api-services';
import {useSCFetchEvent, useSCFetchUser} from '@selfcommunity/react-core';
import {SCEventType, SCUserType} from '@selfcommunity/types';
import {Logger} from '@selfcommunity/utils';
import classNames from 'classnames';
import {HTMLAttributes, useCallback, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {SCOPE_SC_UI} from '../../constants/Errors';
import ConfirmDialog from '../../shared/ConfirmDialog/ConfirmDialog';
import {useSnackbar} from 'notistack';

const PREFIX = 'SCAcceptRequestUserEventButton';

const classes = {
  root: `${PREFIX}-root`
};

const AcceptButton = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface AcceptRequestUserEventButtonProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: HTMLAttributes<HTMLButtonElement>['className'];

  /**
   * Id of the event
   * @default null
   */
  eventId?: number;

  /**
   * Event
   * @default null
   */
  event?: SCEventType;

  /**
   * Id of the user
   * @default null
   */
  userId?: number;

  /**
   * Event
   * @default null
   */
  user?: SCUserType;

  handleConfirm?: ((id: number | null) => void) | null;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Accept Request User Event Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AcceptRequestUserEventButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAcceptRequestUserEventButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAcceptRequestUserEventButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function AcceptRequestUserEventButton(inProps: AcceptRequestUserEventButtonProps): JSX.Element {
  // PROPS
  const props: AcceptRequestUserEventButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, eventId, event, userId, user, handleConfirm = null, ...rest} = props;

  // STATE
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // HOOKS
  const {scEvent} = useSCFetchEvent({id: eventId, event});
  const {scUser} = useSCFetchUser({id: userId, user});
  const {enqueueSnackbar} = useSnackbar();

  const handleConfirmAction = useCallback(() => {
    setLoading(true);

    EventService.inviteOrAcceptEventRequest(scEvent.id, {users: [scUser.id]})
      .then(() => {
        if (handleConfirm) {
          handleConfirm(scUser.id);
        } else {
          enqueueSnackbar(
            <FormattedMessage
              id="ui.acceptRequestUserEventButton.snackbar.success"
              defaultMessage="ui.acceptRequestUserEventButton.snackbar.success"
            />,
            {
              variant: 'error',
              autoHideDuration: 3000
            }
          );
        }
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
  }, [scEvent, scUser]);

  return (
    <>
      <AcceptButton
        size="small"
        variant="outlined"
        onClick={() => setOpenDialog(true)}
        loading={loading}
        className={classNames(classes.root, className)}
        {...rest}>
        <FormattedMessage defaultMessage="ui.acceptRequestUserEventButton.accept" id="ui.acceptRequestUserEventButton.accept" />
      </AcceptButton>

      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          title={<FormattedMessage id="ui.acceptRequestUserEventButton.dialog.title" defaultMessage="ui.acceptRequestUserEventButton.dialog.title" />}
          content={<FormattedMessage id="ui.acceptRequestUserEventButton.dialog.msg" defaultMessage="ui.acceptRequestUserEventButton.dialog.msg" />}
          btnConfirm={
            <FormattedMessage id="ui.acceptRequestUserEventButton.dialog.confirm" defaultMessage="ui.acceptRequestUserEventButton.dialog.confirm" />
          }
          isUpdating={loading}
          onConfirm={handleConfirmAction}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
}
