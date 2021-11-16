import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';

const PREFIX = 'SCCentralProgress';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  padding: 50
}));

export default function CentralProgress({size = 30}: {size: number}): JSX.Element {
  return (
    <Root>
      <CircularProgress
        sx={{
          margin: '0 auto',
          display: 'block'
        }}
        size={size}
      />
    </Root>
  );
}
