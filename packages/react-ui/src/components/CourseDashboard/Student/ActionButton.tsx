import {Button, ButtonProps, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {Link} from '@selfcommunity/react-core';

interface ActionButtonProps extends ButtonProps, Omit<ButtonProps, 'classes'> {
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
    <Button size={size} color={color} variant={variant} {...rest}>
      <Typography variant="body2">
        <FormattedMessage id={labelId} defaultMessage={labelId} />
      </Typography>
    </Button>
  );
}
