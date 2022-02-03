import React from 'react';
import {styled} from '@mui/material/styles';
import {Chip} from '@mui/material';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCNotificationNewChip';

const Root = styled(Chip, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  marginRight: 3,
  fontSize: 11,
  padding: '1px',
  borderRadius: 3,
  height: 20
}));

export interface NotificationNewChipProps {
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function NewChip(props: NotificationNewChipProps): JSX.Element {
  /**
   * Renders root object
   */
  return (
    <Root
      label={<FormattedMessage id="ui.notification.notificationNewChip.label" defaultMessage="ui.notification.notificationNewChip.label" />}
      size="small"
      color="error"
      {...props}
    />
  );
}
