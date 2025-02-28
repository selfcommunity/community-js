import {Button, ButtonProps, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {Link} from '@selfcommunity/react-core';
import {LoadingButton, LoadingButtonProps} from '@mui/lab';

interface ActionButtonProps extends ButtonProps, Omit<LoadingButtonProps, 'classes'> {
  labelId: string;
  to?: string;
}

export default function ActionButton(props: ActionButtonProps) {
  const {labelId, to, size = 'small', color = 'primary', variant = 'contained', ...rest} = props;

  if (to) {
    return (
      <Button component={Link} to={to} size={size} color={color} variant={variant} {...rest}>
        <Typography variant="body2">
          <FormattedMessage id={labelId} defaultMessage={labelId} />
        </Typography>
      </Button>
    );
  }

  return (
    <LoadingButton size={size} color={color} variant={variant} {...rest}>
      <Typography variant="body2">
        <FormattedMessage id={labelId} defaultMessage={labelId} />
      </Typography>
    </LoadingButton>
  );
}
