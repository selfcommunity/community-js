import React from 'react';
import {Button, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {WidgetProps} from '../Widget';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCUserSkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseItem)(({theme}) => ({}));

/**
 * > API documentation for the Community-JS User Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {UserSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCUserSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCUserSkeleton-root|Styles applied to the root element.|
 *
 */
export default function UserSkeleton(props: WidgetProps): JSX.Element {
  const theme = useTheme<SCThemeType>();

  return (
    <Root
      className={classes.root}
      {...props}
      image={
        <Skeleton
          animation="wave"
          variant="circular"
          width={theme.selfcommunity.user.avatar.sizeMedium}
          height={theme.selfcommunity.user.avatar.sizeMedium}
        />
      }
      primary={<Skeleton animation="wave" height={10} width={120} style={{marginBottom: 10}} />}
      secondary={<Skeleton animation="wave" height={10} width={70} style={{marginBottom: 10}} />}
      actions={
        <Button size="small" variant="outlined" disabled>
          <Skeleton animation="wave" height={10} width={50} style={{marginTop: 5, marginBottom: 5}} />
        </Button>
      }
    />
  );
}
