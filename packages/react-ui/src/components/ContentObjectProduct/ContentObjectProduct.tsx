import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {SCContentProduct} from '@selfcommunity/types';
import {PREFIX} from './constants';
import ContentObjectProductSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface ContentObjectProductProps {
  className?: string;
  id?: number | string;
  product?: SCContentProduct;
}

export default function ContentObjectProduct(inProps: ContentObjectProductProps) {
  // PROPS
  const props: ContentObjectProductProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, id, product, ...rest} = props;

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {!product ? <ContentObjectProductSkeleton /> : <></>}
    </Root>
  );
}
