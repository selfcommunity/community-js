import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Button} from '@mui/material';
import BaseItem from '../../shared/BaseItem';

const PREFIX = 'SCCategorySkeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(BaseItem)(({theme}) => ({}));

/**
 * > API documentation for the Community-UI Category Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {CategorySkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCCategorySkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCCategorySkeleton-root|Styles applied to the root element.|
 *
 */
export default function CategorySkeleton(props): JSX.Element {
  return (
    <Root
      className={classes.root}
      {...props}
      image={<Skeleton animation="wave" variant="rectangular" width={40} height={40} />}
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
