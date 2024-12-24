import {Icon, Stack, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {PREFIX} from './constants';
import {HTMLAttributes, memo, ReactNode} from 'react';
import classNames from 'classnames';

const classes = {
  emptyWrapper: `${PREFIX}-empty-wrapper`,
  emptyBox: `${PREFIX}-empty-box`,
  emptyRotatedBox: `${PREFIX}-empty-rotated-box`,
  emptyIcon: `${PREFIX}-empty-icon`
};

interface EmptyProps {
  icon: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

function Empty(props: EmptyProps) {
  // PROPS
  const {icon, title, description, actions, className} = props;

  return (
    <Stack className={classNames(classes.emptyWrapper, className)}>
      <Stack className={classes.emptyBox}>
        <Stack className={classes.emptyRotatedBox}>
          <Icon className={classes.emptyIcon} color="disabled" fontSize="large">
            {icon}
          </Icon>
        </Stack>
      </Stack>

      <Typography variant="body1">
        <FormattedMessage id={title} defaultMessage={title} />
      </Typography>

      <Typography variant="body1">
        <FormattedMessage id={description} defaultMessage={description} />
      </Typography>

      {actions}
    </Stack>
  );
}

export default memo(Empty);
