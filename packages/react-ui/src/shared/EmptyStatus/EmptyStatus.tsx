import {Icon, Stack, styled, Typography} from '@mui/material';
import {FormattedMessage} from 'react-intl';
import {HTMLAttributes, memo, ReactNode} from 'react';
import classNames from 'classnames';

const PREFIX = 'SCEmptyStatus';

const classes = {
  root: `${PREFIX}-root`,
  box: `${PREFIX}-box`,
  rotatedBox: `${PREFIX}-rotated-box`,
  icon: `${PREFIX}-icon`
};

const Root = styled(Stack, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})(() => ({}));

export interface EmptyStatusProps {
  icon: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

function EmptyStatus(props: EmptyStatusProps) {
  // PROPS
  const {icon, title, description, actions, className} = props;

  return (
    <Root className={classNames(classes.root, className)}>
      <Stack className={classes.box}>
        <Stack className={classes.rotatedBox}>
          <Icon className={classes.icon} color="disabled" fontSize="large">
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
    </Root>
  );
}

export default memo(EmptyStatus);
