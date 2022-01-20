import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, AvatarGroup, Skeleton} from '@mui/material';

const PREFIX = 'SCAvatarGroupSkeleton';

const Root = styled(AvatarGroup, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  justifyContent: 'flex-end',
  ['& .MuiAvatar-root']: {
    marginLeft: -6,
    backgroundColor: '#d5d5d5',
    border: 'none',
    color: '#FFF',
    fontSize: '0.85rem',
    width: 24,
    height: 24
  }
}));

export default function AvatarGroupSkeleton(props): JSX.Element {
  return (
    <Root {...props}>
      {[...Array(props.max ? props.max + 1 : 5)].map((x, i) => (
        <Avatar key={i}>
          <Skeleton variant="circular" width={24} height={24} />
        </Avatar>
      ))}
    </Root>
  );
}
