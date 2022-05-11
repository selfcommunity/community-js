import React from 'react';
import {styled} from '@mui/material/styles';
import {Chip, ChipProps} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import useThemeProps from '@mui/material/styles/useThemeProps';
import classNames from 'classnames';

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
  padding: 3,
  borderRadius: 3,
  height: 20,
  display: 'inline',
  float: 'left'
}));

export interface NotificationNewChipProps extends ChipProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
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

  const {className = null} = props;

  /**
   * Renders root object
   */
  return (
    <Root
      className={classNames(classes.root, className)}
      label={<FormattedMessage id="ui.notification.notificationNewChip.label" defaultMessage="ui.notification.notificationNewChip.label" />}
      size="small"
      color="error"
      {...props}
    />
  );
}
