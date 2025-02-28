import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Button, useTheme} from '@mui/material';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  image: `${PREFIX}-image`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  button: `${PREFIX}-button`,
  action: `${PREFIX}-action`
};

const Root = styled(BaseItem, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS ContentObjectProductSkeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {ContentObjectProductSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCContentObjectProductSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCContentObjectProductSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */
export default function ContentObjectProductSkeleton(props): JSX.Element {
  const theme = useTheme<SCThemeType>();
  return (
    <Root
      className={classes.root}
      {...props}
      image={
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={theme.selfcommunity.contentProduct.icon.sizeMedium}
          height={theme.selfcommunity.contentProduct.icon.sizeMedium}
          className={classes.image}
        />
      }
      primary={<Skeleton animation="wave" height={10} width={120} className={classes.primary} />}
      secondary={<Skeleton animation="wave" height={10} width={70} className={classes.secondary} />}
      actions={
        props.actions !== undefined ? (
          props.actions
        ) : (
          <Button size="small" variant="outlined" disabled className={classes.button}>
            <Skeleton animation="wave" height={10} width={50} className={classes.action} />
          </Button>
        )
      }
    />
  );
}
