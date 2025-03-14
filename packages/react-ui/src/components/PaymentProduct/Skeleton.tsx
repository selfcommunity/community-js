import React from 'react';
import {styled} from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import {Accordion, AccordionDetails, AccordionProps, AccordionSummary, useMediaQuery, useTheme} from '@mui/material';
import BaseItem from '../../shared/BaseItem';
import {SCThemeType} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import classNames from 'classnames';
import PaymentProductPriceSkeleton from '../PaymentProductPrice/Skeleton';
import {useThemeProps} from '@mui/system';

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

export interface PaymentProductSkeletonProps extends Pick<AccordionProps, Exclude<keyof AccordionProps, 'children' | 'expanded'>> {
  className?: string;
  expanded?: boolean;
}

/**
 * > API documentation for the Community-JS PaymentProductSkeleton component. Learn about the available props and the CSS API.

 #### Import

 ```jsx
 import {PaymentProductSkeleton} from '@selfcommunity/react-ui';
 ```

 #### Component Name

 The name `SCPaymentProductSkeleton-skeleton-root` can be used when providing style overrides in the theme.

 #### CSS

 |Rule Name|Global class|Description|
 |---|---|---|
 |root|.SCPaymentProductSkeleton-skeleton-root|Styles applied to the root element.|
 *
 */
export default function PaymentProductSkeleton(inProps: PaymentProductSkeletonProps): JSX.Element {
  // PROPS
  const props: PaymentProductSkeletonProps = useThemeProps({
    props: inProps,
    name: `${PREFIX}Skeleton`
  });
  const {className, expanded, ...rest} = props;

  // HOOKS
  const theme = useTheme<SCThemeType>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Root defaultExpanded square className={classNames(classes.root)} {...(expanded && {expanded})} {...rest}>
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
        <PaymentProductPriceSkeleton />
        <PaymentProductPriceSkeleton />
        <PaymentProductPriceSkeleton />
      </AccordionDetails>
    </Root>
  );
}
