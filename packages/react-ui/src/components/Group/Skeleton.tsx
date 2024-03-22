import React from 'react';
import {Button, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {WidgetProps} from '../Widget';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS Group Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {GroupSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCGroup-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCGroup-skeleton-root|Styles applied to the root element.|
 *
 */
export default function GroupSkeleton(props: WidgetProps): JSX.Element {
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
          <Skeleton animation="wave" height={10} width={30} style={{marginTop: 5, marginBottom: 5}} />
        </Button>
      }
    />
  );
}
