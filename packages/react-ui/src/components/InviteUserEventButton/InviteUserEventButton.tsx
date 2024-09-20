import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useThemeProps } from '@mui/system';
import { EventService } from '@selfcommunity/api-services';
import { useSCFetchEvent, useSCFetchUser } from '@selfcommunity/react-core';
import { SCEventType, SCUserType } from '@selfcommunity/types';
import { Logger } from '@selfcommunity/utils';
import classNames from 'classnames';
import { HTMLAttributes, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { SCOPE_SC_UI } from '../../constants/Errors';

const PREFIX = 'SCInviteUserEventButton';

const classes = {
  root: `${PREFIX}-root`
};

const InviteButton = styled(LoadingButton, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface InviteUserEventButtonProps {
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

  handleInvitations?: ((invited: boolean) => void) | null;

  /**
   * Others properties
   */
  [p: string]: any;
}

/**
 * > API documentation for the Community-JS Invite Event Button component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {InviteUserEventButton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCInviteUserEventButton` can be used when providing style overrides in the theme.


 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCInviteUserEventButton-root|Styles applied to the root element.|

 * @param inProps
 */
export default function InviteUserEventButton(inProps: InviteUserEventButtonProps): JSX.Element {
  // PROPS
  const props: InviteUserEventButtonProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const { className, eventId, event, userId, user, handleInvitations, ...rest } = props;

  // STATE
  const [invited, setInvited] = useState<boolean | null>(true);

  //HOOKS
  const { scEvent } = useSCFetchEvent({ id: eventId, event });
  const { scUser } = useSCFetchUser({ id: userId, user });

  const handleInviteAction = useCallback(() => {
    setInvited(null);

    if (invited) {
      EventService.removeInviteEvent(scEvent.id, { users: [scUser.id] })
        .then(() => {
          setInvited(false);
          handleInvitations?.(true);
        })
        .catch((_error) => {
          Logger.error(SCOPE_SC_UI, _error);
        });
    } else {
      EventService.inviteOrAcceptEventRequest(scEvent.id, { users: [scUser.id] })
        .then(() => {
          setInvited(true);
          handleInvitations?.(false);
        })
        .catch((_error) => {
          Logger.error(SCOPE_SC_UI, _error);
        });
    }
  }, [scEvent, scUser, invited]);

  return (
    <InviteButton
      size="small"
      variant="outlined"
      onClick={handleInviteAction}
      loading={invited === null}
      className={classNames(classes.root, className)}
      {...rest}>
      {invited ? (
        <FormattedMessage defaultMessage="ui.inviteUserEventButton.remove" id="ui.inviteUserEventButton.remove" />
      ) : (
        <FormattedMessage defaultMessage="ui.inviteUserEventButton.invite" id="ui.inviteUserEventButton.invite" />
      )}
    </InviteButton>
  );
}
