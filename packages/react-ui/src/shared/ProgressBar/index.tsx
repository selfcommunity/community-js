import LinearProgress, {LinearProgressProps} from '@mui/material/LinearProgress';
import {Box, Typography} from '@mui/material';
import React from 'react';
import {styled} from '@mui/material/styles';
import classNames from 'classnames';

const PREFIX = 'SCProgressBar';

const classes = {
  root: `${PREFIX}-root`,
  bar: `${PREFIX}-bar`,
  progress: `${PREFIX}-progress`,
  message: `${PREFIX}-message`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({}));

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
   * The progress bar loading message
   * @default null
   */
  loadingMessage?: React.ReactNode;
  /**
   * Any other properties
   */
  [p: string]: any;
}

export default function ProgressBar(props: ProgressBarProps) {
  const {className, value, loadingMessage = null, ...rest} = props;
  return (
    <Root className={classNames(classes.root, className)}>
      <Box className={classes.message}>{loadingMessage}</Box>
      <LinearProgress variant="determinate" color="success" className={classes.bar} value={value} {...rest} />
      <Box className={classes.progress}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Root>
  );
}
