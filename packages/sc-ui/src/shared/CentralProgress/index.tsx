import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {styled} from '@mui/material/styles';
import {Box} from '@mui/material';
import {CircularProgressProps} from '@mui/material/CircularProgress/CircularProgress';

const PREFIX = 'SCCentralProgress';

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: 'calc(100% - 100px)',
  padding: 50
}));

export default function CentralProgress(props: CircularProgressProps): JSX.Element {
  return (
    <Root>
      <CircularProgress
        sx={{
          margin: '0 auto',
          display: 'block'
        }}
        {...props}
      />
    </Root>
  );
}
