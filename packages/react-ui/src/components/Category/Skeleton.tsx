import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Button} from '@mui/material';
import BaseItem from '../../shared/BaseItem';

const PREFIX = 'SCCategorySkeleton';

const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  button: `${PREFIX}-button`,
  action: `${PREFIX}-action`
};

const Root = styled(BaseItem)(({theme}) => ({
  [`& .${classes.primary}`]: {
    marginBottom: theme.spacing()
  },
  [`& .${classes.secondary}`]: {
    marginBottom: theme.spacing()
  },
  [`& .${classes.button}`]: {
    margin: theme.spacing()
  },
  [`& .${classes.action}`]: {
    margin: theme.spacing()
  }
}));

/**
 * > API documentation for the Community-JS Category Skeleton component. Learn about the available props and the CSS API.

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
      image={<Skeleton animation="wave" variant="rectangular" width={40} height={40} className={classes.image} />}
      primary={<Skeleton animation="wave" height={10} width={120} className={classes.primary} />}
      secondary={<Skeleton animation="wave" height={10} width={70} className={classes.secondary} />}
      actions={
        <Button size="small" variant="outlined" disabled className={classes.button}>
          <Skeleton animation="wave" height={10} width={50} className={classes.action} />
        </Button>
      }
    />
  );
}
