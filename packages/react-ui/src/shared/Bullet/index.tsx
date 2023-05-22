import React from 'react';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';

const PREFIX = 'SCBullet';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled('span', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({}));

export default function Bullet(inProps): JSX.Element {
  // PROPS
  const {className, ...props}: any = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  return (
    <Root className={classNames(className, classes.root)} {...props}>
      •
    </Root>
  );
}
