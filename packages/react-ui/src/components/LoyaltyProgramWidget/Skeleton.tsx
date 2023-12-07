import React from 'react';
import {styled} from '@mui/material/styles';
import {Button, CardActions, CardContent, Skeleton, Typography} from '@mui/material';
import Widget from '../Widget';
import {PREFIX} from './constants';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  chip: `${PREFIX}-chip`,
  points: `${PREFIX}-points`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'SkeletonRoot'
})(() => ({}));
/**
 * > API documentation for the Community-JS Loyalty Program Widget Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgramWidgetSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgramWidget-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramWidget-skeleton-root|Styles applied to the root element.|
 |title|.SCLoyaltyProgramWidget-title|Styles applied to the title element.|
 |content|.SCLoyaltyProgramWidget-content|Styles applied to the card content section.|
 |chip|.SCLoyaltyProgramWidget-chip|Styles applied to the card chip element.|
 |points|.SCLoyaltyProgramWidget-points|Styles applied to the card actions points element.|
 |actions|.SCLoyaltyProgramWidget-actions|Styles applied to the action section.|
 *
 */
export default function LoyaltyProgramWidgetSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.title}>
          <Skeleton animation="wave" height={25} width="40%" variant="rectangular" />
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Typography className={classes.points}>
          <Skeleton animation="wave" variant="circular" width={60} height={30} className={classes.chip} />
          <Skeleton animation="wave" height={20} width={90} variant="rectangular" />
        </Typography>
        <Button disabled variant={'outlined'} size={'small'}>
          <Skeleton animation="wave" height={20} width={70} variant="text" />
        </Button>
      </CardActions>
    </Root>
  );
}
