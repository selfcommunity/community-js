import React from 'react';
import {styled} from '@mui/material/styles';
import {CardActions, CardContent, Grid, Skeleton, Typography} from '@mui/material';
import Widget from '../Widget';

const PREFIX = 'SCLoyaltyProgramSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.header}`]: {
    display: 'flex',
    alignItems: 'start',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2)
  },
  [`& .${classes.title}`]: {
    display: 'flex'
  },
  [`& .${classes.actions}`]: {
    justifyContent: 'space-between'
  }
}));
/**
 * > API documentation for the Community-JS Loyalty Program Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgramSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgramSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramSkeleton-root|Styles applied to the root element.|
 |header|.SCLoyaltyProgramSkeleton-header|Styles applied to the card header element.|
 |title|.SCLoyaltyProgramSkeleton-title|Styles applied to the title element.|
 |content|.SCLoyaltyProgramSkeleton-content|Styles applied to the card content section.|
 |actions|.SCLoyaltyProgramSkeleton-actions|Styles applied to the action section.|
 *
 */
export default function LoyaltyProgramSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.title}>
          <Skeleton animation="wave" height={40} width="50%" variant="text" />
        </Typography>
        <Grid container spacing={2} className={classes.header}>
          <Grid item>
            <Skeleton animation="wave" variant="rectangular" width={40} height={40} />
          </Grid>
          <Grid item xs={12} sm container>
            <Skeleton animation="wave" height={20} width="50%" variant="text" />
            <Skeleton animation="wave" height={10} width="100%" variant="text" />
            <Skeleton animation="wave" height={10} width="70%" variant="text" />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <Skeleton animation="wave" height={30} width="30%" variant="rectangular" />
        <Skeleton animation="wave" height={20} width="30%" variant="rectangular" />
      </CardActions>
    </Root>
  );
}
