import React from 'react';
import {styled} from '@mui/material/styles';
import {Typography, CardContent, Skeleton, CardActions, CardMedia, Button} from '@mui/material';
import {Widget} from '@selfcommunity/react-ui';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-prize-item-skeleton-root`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'PrizeItemSkeletonRoot'
})(() => ({}));

/**
 * > API documentation for the Community-JS PrizeItemSkeleton Skeleton component. Learn about the available props and the CSS API.

 #### Component Name

 The name `SCLoyaltyProgramDetailTemplate-prize-item-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramDetailTemplate-prize-item-skeleton-root|Styles applied to the root element.|
 |content|.SCLoyaltyProgramDetailTemplate-content|Styles applied to the card content section.|
 |actions|.SCLoyaltyProgramDetailTemplate-actions|Styles applied to the actions section.|
 *
 */
export default function PrizeItemSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardMedia>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={137} />
      </CardMedia>
      <CardContent>
        <Typography className={classes.content}>
          <Skeleton animation="wave" height={20} width="80%" variant="text" />
          <Skeleton animation="wave" height={10} width="70%" variant="text" style={{marginTop: 8}} />
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button disabled variant={'outlined'} size={'small'}>
          <Skeleton animation="wave" height={10} width={50} variant="text" />
        </Button>
        <Button disabled variant={'text'} size={'small'}>
          <Skeleton animation="wave" height={20} width={70} variant="text" />
        </Button>
      </CardActions>
    </Root>
  );
}
