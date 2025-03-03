import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Accordion, AccordionDetails, AccordionSummary, Button, Icon, Typography, useMediaQuery, useTheme} from '@mui/material';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import classNames from 'classnames';
import ContentObjectProductPriceSkeleton from '../ContentObjectProductPrice/Skeleton';

const classes = {
  root: `${PREFIX}-skeleton-root`,
  image: `${PREFIX}-image`,
  primary: `${PREFIX}-primary`,
  secondary: `${PREFIX}-secondary`,
  button: `${PREFIX}-button`,
  action: `${PREFIX}-action`
};

const Root = styled(Accordion, {
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
  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Root defaultExpanded square className={classNames(classes.root)}>
      <AccordionSummary aria-controls="panel1-content" id="panel1-header">
        <BaseItem
          elevation={0}
          image={
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={theme.selfcommunity.contentProduct.icon.sizeSmall}
              height={theme.selfcommunity.contentProduct.icon.sizeSmall}
              className={classes.image}
            />
          }
          primary={<Skeleton animation="wave" height={10} width={isMobile ? 70 : 120} className={classes.primary} />}
          secondary={<Skeleton animation="wave" height={10} width={isMobile ? 40 : 70} className={classes.secondary} />}
        />
      </AccordionSummary>
      <AccordionDetails>
        <ContentObjectProductPriceSkeleton />
        <ContentObjectProductPriceSkeleton />
        <ContentObjectProductPriceSkeleton />
      </AccordionDetails>
    </Root>
  );
}
