import React from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import {Snackbar, Alert, SnackbarProps} from '@mui/material';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

const PREFIX = 'SCUserDeletedSnackBar';

const classes = {
  root: `${PREFIX}-root`
};

export interface UserDeletedSnackBarProps extends SnackbarProps {
  className?: string;
  open: boolean;
  handleClose: () => void;
}

const Root = styled(Snackbar, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}: any) => ({}));

export default function UserDeletedSnackBar(inProps: UserDeletedSnackBarProps): JSX.Element {
  // PROPS
  const props: UserDeletedSnackBarProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, open, handleClose, ...rest} = props;
  return (
    <Root className={classNames(className, classes.root)} open={open} autoHideDuration={3000} onClose={handleClose} {...rest}>
      <Alert severity="warning" onClose={handleClose}>
        <FormattedMessage id="ui.common.actionToUserDeleted" defaultMessage="ui.common.actionToUserDeleted" />
      </Alert>
    </Root>
  );
}
