import React, {ReactElement} from 'react';
import {Icon, IconButton, IconButtonProps, styled} from '@mui/material';
import {PREFIX} from './constants';
import classNames from 'classnames';

const classes = {
  triggerRoot: `${PREFIX}-trigger-root`
};

const Root = styled(IconButton, {
  name: PREFIX,
  slot: 'TriggerRoot'
})(() => ({}));

export default ({className, ...rest}: IconButtonProps): ReactElement => {
  return (
    <Root className={classNames(className, classes.triggerRoot)} {...rest} aria-label="add link">
      <Icon>link</Icon>
    </Root>
  );
};
