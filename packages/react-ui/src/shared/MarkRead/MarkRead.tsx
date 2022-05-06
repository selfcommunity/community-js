import React, {useEffect} from 'react';
import {EndpointType, http} from '@selfcommunity/react-core';
import LazyLoad from 'react-lazyload';

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
    <LazyLoad once>
      <MarkRead {...props} />
    </LazyLoad>
  );
};
