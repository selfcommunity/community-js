import React from 'react';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCBullet';

const Root = styled('span', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  display: 'inline-block',
  margin: '0 4px',
  transform: 'scale(1.2)'
}));

export default function Bullet(): JSX.Element {
  return <Root>•</Root>;
}
