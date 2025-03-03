import React from 'react';
import {AccordionDetails, AccordionSummary, Divider, Icon, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {SCContentProduct, SCContentType} from '@selfcommunity/types';
import {PREFIX} from './constants';
import ContentObjectProductSkeleton from './Skeleton';
import Accordion from '@mui/material/Accordion';
import ContentObjectProductPrice from '../ContentObjectProductPrice';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Accordion, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface ContentObjectProductProps {
  className?: string;
  id?: number | string;
  product?: SCContentProduct;
  contentType: SCContentType;
  contentId: number | string;
}

export default function ContentObjectProduct(inProps: ContentObjectProductProps) {
  // PROPS
  const props: ContentObjectProductProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, id, product, contentType, contentId, ...rest} = props;

  if (!product) {
    return <ContentObjectProductSkeleton />;
  }

  return (
    <Root defaultExpanded square className={classNames(classes.root, className)} {...rest}>
      <AccordionSummary aria-controls="panel1-content" id="panel1-header">
        <Typography variant="h5" component="div">
          <b>{product.name}</b>
        </Typography>
        {product.description && (
          <Typography variant="body1" component="div">
            {product.description}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {product.prices.map((price, index) => (
          <ContentObjectProductPrice price={price} key={index} contentType={contentType} contentId={contentId} />
        ))}
      </AccordionDetails>
    </Root>
  );
}
