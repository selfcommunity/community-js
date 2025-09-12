import React, {useEffect, useRef} from 'react';
import {http, EndpointType, HttpResponse} from '@selfcommunity/api-services';
import LazyLoad from 'react-lazyload';
import {MIN_PRELOAD_OFFSET_VIEWPORT} from '../../constants/LazyLoad';
import {useInView} from 'react-intersection-observer';

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
  const {ref, inView} = useInView({threshold: 0.1});
  const hasEntered = useRef(false);

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
    if (inView) {
      hasEntered.current = true;
    } else if (hasEntered.current && endpoint && !inView) {
      performRequest();
    }
  }, [inView]);

  return <div ref={ref}></div>;
};

export default (props: MarkReadProps): JSX.Element => {
  return (
    <LazyLoad once offset={MIN_PRELOAD_OFFSET_VIEWPORT}>
      <MarkRead {...props} />
    </LazyLoad>
  );
};
