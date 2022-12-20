import React from 'react';
import {styled} from '@mui/material/styles';
import {Typography, CardContent, CardHeader, Grid, Skeleton, Box, CardActions} from '@mui/material';
import Widget from '../Widget';

const PREFIX = 'SCLoyaltyProgramDetailSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  title: `${PREFIX}-title`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  list: `${PREFIX}-list`,
  listItem: `${PREFIX}-list-item`,
  chip: `${PREFIX}-chip`
};

const Root = styled(Widget, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.list}`]: {
    display: 'flex',
    flexDirection: 'row'
  }
}));
const PrizeRoot = styled(Widget, {
  name: `${PREFIX}-Prize`,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({
  [`& .${classes.root}`]: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  [`& .${classes.chip}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  [`& .${classes.actions}`]: {
    justifyContent: 'center'
  }
}));
/**
 * > API documentation for the Community-JS Loyalty Program Detail Skeleton Prize component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgramDetailSkeletonPrize} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgramDetailSkeletonPrize` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramDetailSkeletonPrize-root|Styles applied to the root element.|
 |chip|.SCLoyaltyProgramDetailSkeletonPrize-chip|Styles applied to the chip element.|
 |content|.SCLoyaltyProgramDetailSkeletonPrize-content|Styles applied to the card content section.|
 |title|.SCLoyaltyProgramDetailSkeletonPrize-title|Styles applied to the title element.|
 |actions|.SCLoyaltyProgramDetailSkeletonPrize-actions|Styles applied to the action section.|
 *
 */
export function PrizeSkeleton(): JSX.Element {
  return (
    <PrizeRoot className={classes.root}>
      <Skeleton animation="wave" variant="rectangular" width="100%" height={40} />
      <Box className={classes.chip}>
        <Skeleton animation="wave" variant="circular" width={30} height={15} />
      </Box>
      <CardContent className={classes.content}>
        <Typography gutterBottom variant="body1" component="div" className={classes.title}>
          <Skeleton animation="wave" height={15} width="70%" variant="text" />
        </Typography>
        <Typography variant="body2">
          <Skeleton animation="wave" height={10} width="100%" variant="text" />
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <Skeleton animation="wave" height={20} width={50} variant="rectangular" />
      </CardActions>
    </PrizeRoot>
  );
}

/**
 * > API documentation for the Community-JS Loyalty Program Detail Skeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {LoyaltyProgramDetailSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCLoyaltyProgramDetailSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramDetailSkeleton-root|Styles applied to the root element.|
 |header|.SCLoyaltyProgramDetailSkeleton-header|Styles applied to the card header element.|
 |content|.SCLoyaltyProgramDetailSkeleton-content|Styles applied to the card content section.|
 |list|.SCLoyaltyProgramDetailSkeleton-list|Styles applied to the list section.|
 |listItem|.SCLoyaltyProgramDetailSkeleton-list-item|Styles applied to the list item elements.|
 *
 */
export default function LoyaltyProgramDetailSkeleton(): JSX.Element {
  return (
    <Root className={classes.root}>
      <CardHeader
        className={classes.header}
        avatar={<Skeleton animation="wave" variant="rectangular" width={40} height={40} />}
        title={<Skeleton animation="wave" variant="circular" width={30} height={15} />}
      />
      <CardContent className={classes.content}>
        <React.Fragment>
          <Skeleton animation="wave" height={15} width="70%" variant="text" />
          <Skeleton animation="wave" height={10} width="90%" variant="text" />
        </React.Fragment>
        <Typography mt={1} className={classes.title}>
          <Skeleton animation="wave" height={10} width="40%" />
        </Typography>
        <Grid container spacing={0} mt={0.5} mb={1} className={classes.list}>
          {[...Array(8)].map((prize, index) => (
            <Grid item xs={6} key={index} className={classes.listItem}>
              <Skeleton animation="wave" height={10} width="50%" />
            </Grid>
          ))}
        </Grid>
        <Typography mb={1}>
          <Skeleton animation="wave" height={15} width="60%" variant="text" className={classes.title} />
          <Skeleton animation="wave" height={10} width="80%" variant="text" />
          <Skeleton animation="wave" height={10} width="100%" variant="text" />
        </Typography>
        <Grid container spacing={{xs: 2}} columns={{xs: 4}} className={classes.list}>
          {[...Array(4)].map((prize, index) => (
            <Grid item xs={2} key={index} className={classes.listItem}>
              <PrizeRoot>
                <PrizeSkeleton />
              </PrizeRoot>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Root>
  );
}
