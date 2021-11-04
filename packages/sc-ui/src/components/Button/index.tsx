import React from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import {withSCTheme} from '@selfcommunity/core';

const PREFIX = 'SCFollowButton';

const SCButton = styled(Button, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  border: '0px',
  color: 'black',
  borderRadius: 20,
  backgroundColor: '#e2e2e2',
  paddingTop: '4px',
  paddingRight: '16px',
  paddingBottom: '4px',
  paddingLeft: '16px'
}));

function FollowButton({onClick, children}: {onClick?: () => void | undefined; children?: React.ReactNode}): JSX.Element {
  return (
    <SCButton size="small" onClick={onClick}>
      {children}
    </SCButton>
  );
}

export default withSCTheme(FollowButton);
