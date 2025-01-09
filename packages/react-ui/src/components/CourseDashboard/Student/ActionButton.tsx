import {Button, ButtonProps, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';

interface ActionButtonProps extends ButtonProps {
  labelId: string;
}

export default function ActionButton(props: ActionButtonProps) {
  const {labelId, size = 'small', color = 'primary', variant = 'contained', ...rest} = props;

  return (
    <Button size={size} color={color} variant={variant} {...rest}>
      <Typography variant="body2">
        <FormattedMessage id={labelId} defaultMessage={labelId} />
      </Typography>
    </Button>
  );
}
