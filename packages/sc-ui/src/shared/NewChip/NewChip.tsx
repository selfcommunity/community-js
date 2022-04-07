import React from 'react';
import {styled} from '@mui/material/styles';
import {Chip, ChipProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import useThemeProps from '@mui/material/styles/useThemeProps';

const PREFIX = 'SCNotificationNewChip';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Chip, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  marginRight: 3,
  fontSize: 11,
  padding: '1px',
  borderRadius: 3,
  height: 20,
  float: 'left'
}));

export interface NotificationNewChipProps extends ChipProps {
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function NewChip(inProps: NotificationNewChipProps): JSX.Element {

  const props: NotificationNewChipProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });

  /**
   * Renders root object
   */
  return (
    <Root
      className={classes.root}
      label={<FormattedMessage id="ui.notification.notificationNewChip.label" defaultMessage="ui.notification.notificationNewChip.label" />}
      size="small"
      color="error"
      {...props}
    />
  );
}
