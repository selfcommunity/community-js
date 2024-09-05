import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';
import {Box, Typography} from '@mui/material';
import React from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';

const PREFIX = 'SCProgressBar';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

export interface ProgressBarProps extends LinearProgressProps {
  /**
   * Overrides or extends the styles applied to the component.
   * @default null
   */
  className?: string;
  /**
   * The progress percentage value
   */
  value: number;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ProgressBar(props: ProgressBarProps) {
  const {className, value, ...rest} = props;
  return (
    <Root className={classNames(classes.root, className)}>
      <LinearProgress variant="determinate" {...rest} />
      <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
    </Root>
  );
}
