import React, { ReactElement } from 'react';
import { Box, IconButton, IconButtonProps } from '@mui/material';
import Icon from '@mui/material/Icon';
import { PREFIX } from './constants';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';

const classes = {
  triggerRoot: `${PREFIX}-trigger-root`
};


const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'TriggerRoot',
  overridesResolver: (props, styles) => styles.triggerRoot
})(() => ({}));

export default ({className, ...rest}: IconButtonProps): ReactElement => {
  return (
    <Root className={classNames(className, classes.triggerRoot)} {...rest} aria-label="add link">
      <Icon>link</Icon>
    </Root>
  );
};
