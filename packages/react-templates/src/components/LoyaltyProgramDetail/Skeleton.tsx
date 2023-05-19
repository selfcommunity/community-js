import React from 'react';
import {styled} from '@mui/material/styles';
import {Typography, Grid, Skeleton, Box, useTheme, useMediaQuery} from '@mui/material';
import {SCThemeType} from '@selfcommunity/react-core';
import PrizeItemSkeleton from './PrizeItemSkeleton';

const PREFIX = 'SCLoyaltyProgramDetailTemplateSkeleton';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  sectionTitle: `${PREFIX}-section-title`,
  subTitle: `${PREFIX}-sub-title`,
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
 import {LoyaltyProgramDetailSkeleton} from '@selfcommunity/react-templates';
 ```

 #### Component Name

 The name `SCLoyaltyProgramDetailTemplateSkeleton` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCLoyaltyProgramDetailTemplateSkeleton-root|Styles applied to the root element.|
 |title|.SCLoyaltyProgramDetailTemplateSkeleton-title|Styles applied to the title element.|
 |sectionTitle|.SCLoyaltyProgramDetailTemplateSkeleton-section-title|Styles applied to the section title element.|
 |subTitle|.SCLoyaltyProgramDetailTemplateSkeleton-subTitle|Styles applied to the subTitle element.|
 |pointsList|.SCLoyaltyProgramDetailTemplateSkeleton-points-list|Styles applied to the points list section.|
 |chip|.SCLoyaltyProgramDetailTemplateSkeleton-chip|Styles applied to the chip element.|
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
      <Grid container spacing={isMobile ? 3 : 6}>
        {[...Array(6)].map((prize, index) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
            <PrizeItemSkeleton />
          </Grid>
        ))}
      </Grid>
    </Root>
  );
}
