import React from 'react';
import {styled} from '@mui/material/styles';

const PREFIX = 'SCHiddenPlaceholder';

const Root = styled('div', {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})(() => ({
  height: 1,
  width: '100%',
  display: 'none'
}));

export default function HiddenPlaceholder(props): JSX.Element {
  return <Root {...props}></Root>;
}
