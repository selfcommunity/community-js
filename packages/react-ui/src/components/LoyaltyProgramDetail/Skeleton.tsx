import React from 'react';
import {styled} from '@mui/material/styles';
import {Typography, CardContent, CardHeader, Grid, Skeleton, Box, CardActions, useTheme, useMediaQuery, CardMedia, Button} from '@mui/material';
import Widget from '../Widget';
import {SCThemeType} from '@selfcommunity/react-core';

const PREFIX = 'SCLoyaltyProgramDetailSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  sectionTitle: `${PREFIX}-section-title`,
  subTitle: `${PREFIX}-sub-title`,
  content: `${PREFIX}-content`,
  actions: `${PREFIX}-actions`,
  prizeSection: `${PREFIX}-prize-section`,
  prizeItem: `${PREFIX}-prize-item`,
  pointsList: `${PREFIX}-points-list`,
  chip: `${PREFIX}-chip`
};

const Root = styled(Box, {
  name: PREFIX,
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})(({theme}) => ({}));

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
 |content|.SCLoyaltyProgramDetailSkeleton-content|Styles applied to the card content section.|
 |list|.SCLoyaltyProgramDetailSkeleton-list|Styles applied to the list section.|
 |listItem|.SCLoyaltyProgramDetailSkeleton-list-item|Styles applied to the list item elements.|
 *
 */
export default function LoyaltyProgramDetailSkeleton(): JSX.Element {
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Root className={classes.root}>
      <Typography className={classes.title} component={'div'}>
        {!isMobile && <Skeleton animation="wave" height={30} width={140} variant="text" />}
        <Skeleton animation="wave" variant="circular" width={172} height={30} className={classes.chip} />
      </Typography>
      <Typography className={classes.sectionTitle}>
        <Skeleton animation="wave" height={20} width={'50%'} variant="text" />
        <Skeleton animation="wave" height={17} width={'80%'} variant="text" className={classes.subTitle} />
      </Typography>
      <Typography className={classes.sectionTitle}>
        <Skeleton animation="wave" height={20} width={146} />
      </Typography>
      <Grid container spacing={2} className={classes.pointsList}>
        {[...Array(8)].map((prize, index) => (
          <Grid item xs={12} sm={12} md={6} key={index}>
            <Skeleton animation="wave" height={15} width="100%" />
          </Grid>
        ))}
      </Grid>
      <Typography className={classes.sectionTitle}>
        <Skeleton animation="wave" height={20} width={140} variant="text" />
      </Typography>
      <Grid container spacing={isMobile ? 3 : 6} className={classes.prizeSection}>
        {[...Array(6)].map((prize, index) => (
          <Grid item xs={12} sm={12} md={3} key={index} className={classes.prizeItem}>
            <Widget>
              <CardMedia>
                <Skeleton animation="wave" variant="rectangular" width="100%" height={137} />
              </CardMedia>
              <CardContent>
                <Typography className={classes.content}>
                  <Skeleton animation="wave" variant="circular" width={60} height={30} className={classes.sectionTitle} />
                  <Skeleton animation="wave" height={20} width="80%" variant="text" />
                  <Skeleton animation="wave" height={10} width="70%" variant="text" />
                  <Skeleton animation="wave" height={10} width="70%" variant="text" />
                  <Skeleton animation="wave" height={10} width="70%" variant="text" />
                  <Skeleton animation="wave" height={10} width="70%" variant="text" />
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
            </Widget>
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
