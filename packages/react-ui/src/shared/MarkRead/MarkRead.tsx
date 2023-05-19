import React, {useEffect} from 'react';
import {http, EndpointType, HttpResponse} from '@selfcommunity/api-services';
import LazyLoad from 'react-lazyload';
import {MIN_PRELOAD_OFFSET_VIEWPORT} from '../../constants/LazyLoad';

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
  /**
   * Callback
   * @default null
   */
  callback?: any;
}

const MarkRead = (props: MarkReadProps): JSX.Element => {
  // PROPS
  const {endpoint, params = {}, callback, data = null} = props;

  /**
   * Perform request
   */
  const performRequest = () => {
    http
      .request({
        url: endpoint.url(params),
        method: endpoint.method,
        data
      })
      .then((res: HttpResponse<any>) => {
        callback && callback(res);
      })
      .catch(() => null);
  };

  useEffect(() => {
    let _t;
    if (endpoint) {
      _t = setTimeout(performRequest);
      return () => {
        _t && clearTimeout(_t);
      };
    }
  }, []);

  return null;
};

export default (props: MarkReadProps): JSX.Element => {
  return (
    <LazyLoad once offset={MIN_PRELOAD_OFFSET_VIEWPORT}>
      <MarkRead {...props} />
    </LazyLoad>
  );
};
