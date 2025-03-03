import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useThemeProps} from '@mui/system';
import classNames from 'classnames';
import {Endpoints, PaymentApiClient} from '@selfcommunity/api-services';
import {SCContentProduct, SCContentType} from '@selfcommunity/types';
import {useIsComponentMountedRef} from '@selfcommunity/react-core';
import {PREFIX} from './constants';
import ContentObjectProductsSkeleton from './Skeleton';
import ContentObjectProduct from '../ContentObjectProduct';
import {Logger} from '@selfcommunity/utils';
import {SCOPE_SC_UI} from '../../constants/Errors';
import {AxiosRequestConfig} from 'axios';

const classes = {
  root: `${PREFIX}-root`
};

const Root = styled(Box, {
  slot: 'Root',
  name: PREFIX
})(({theme}) => ({}));

export interface ContentObjectPricesProps {
  className?: string;
  contentType: SCContentType;
  id: number | string;
  prefetchedProducts?: SCContentProduct[];
}

export default function ContentObjectProducts(inProps: ContentObjectPricesProps) {
  // PROPS
  const props: ContentObjectPricesProps = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {className, id, contentType, prefetchedProducts = [], ...rest} = props;

  const [products, setProducts] = useState<SCContentProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isMountedRef = useIsComponentMountedRef();

  /**
   * Fetches categories list
   */
  const fetchProducts = async (next: string = Endpoints.GetContentProducts.url({})): Promise<SCContentProduct[]> => {
    const data = await PaymentApiClient.getContentProducts({content_id: id, content_type: contentType}, {url: next} as AxiosRequestConfig);
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
      {loading ? (
        <ContentObjectProductsSkeleton />
      ) : (
        <>
          {products.map((p, i) => (
            <ContentObjectProduct product={p} key={i} contentType={contentType} contentId={id} />
          ))}
        </>
      )}
    </Root>
  );
}
