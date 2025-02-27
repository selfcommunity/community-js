import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {SCContentType} from '../../types/paywall';
import {CategoryService, Endpoints} from '@selfcommunity/api-services';
import {SCCategoryType, SCContentProduct} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {useIsComponentMountedRef} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import ContentObjectPricesSkeleton from './Skeleton';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface ContentObjectPricesProps {
  className?: string;
  contentType?: SCContentType;
  id?: number | string;
  prefetchedProducts?: SCContentProduct[];
}

export default function ContentObjectPrices(inProps: ContentObjectPricesProps) {
  // PROPS
  const props: ContentObjectPricesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, id, contentType, prefetchedProducts = [], ...rest} = props;

  const [products, setProducts] = useState<SCCategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Fetches categories list
   */
  const fetchProducts = async (next: string = Endpoints.CategoryList.url({id, active: true})): Promise<SCContentProduct[]> => {
    const data = await CategoryService.getAllCategories({id, active: true}, {url: next} as AxiosRequestConfig);
    return data.next ? data.results.concat(await fetchProducts(data.next)) : data.results;
  };

  /**
   * On mount, fetches products/prices list
   */
  useEffect(() => {
    if (prefetchedProducts.length) {
      setProducts(prefetchedProducts);
      setLoading(false);
    } else {
      fetchProducts()
        .then((data) => {
          if (isMountedRef.current) {
            setProducts(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          Logger.error(SCOPE_SC_UI, error);
        });
    }
  }, [prefetchedProducts.length]);

  return (
    <Root className={classNames(classes.root, className)} {...rest}>
      {loading ? <ContentObjectPricesSkeleton /> : <></>}
    </Root>
  );
}
