import React from 'react';
import {styled} from '@mui/material/styles';
import {Avatar, AvatarGroup, Skeleton} from '@mui/material';

const PREFIX = 'SCAvatarGroupSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

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
/**
 * > API documentation for the Community-UI Avatar Group Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {AvatarGroupSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCAvatarGroupSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCAvatarGroupSkeleton-root|Styles applied to the root element.|
 *
 */
export default function AvatarGroupSkeleton(props): JSX.Element {
  const {count = 2, ...rest} = props;
  return (
    <Root className={classes.root} {...rest}>
      {[...Array(count + 1)].map((x, i) => (
        <Avatar key={i}>
          <Skeleton variant="circular" width={24} height={24} />
        </Avatar>
      ))}
    </Root>
  );
}
