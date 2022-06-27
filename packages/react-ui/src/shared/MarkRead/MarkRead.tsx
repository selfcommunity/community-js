import React, {useEffect} from 'react';
import {http, EndpointType} from '@selfcommunity/api-services';
import LazyLoad from 'react-lazyload';
import {PRELOAD_OFFSET_VIEWPORT} from '../../constants/LazyLoad';

export interface MarkReadProps {
  /**
   * Endpoint to mark read
   */
  endpoint: EndpointType;
  /**
   * Params to insert into the url
   * @default object
   */
  params?: any;
  /**
   * Data to post to the endpoint
   * @default null
   */
  data?: any;
}

const MarkRead = (props: MarkReadProps): JSX.Element => {
  // PROPS
  const {endpoint, params = {}, data = null} = props;
  useEffect(() => {
    http
      .request({
        url: endpoint.url(params),
        method: endpoint.method,
        data
      })
      .catch(() => null);
  }, []);
  return null;
};

export default (props: MarkReadProps): JSX.Element => {
  return (
    <LazyLoad once offset={PRELOAD_OFFSET_VIEWPORT}>
      <MarkRead {...props} />
    </LazyLoad>
  );
};
