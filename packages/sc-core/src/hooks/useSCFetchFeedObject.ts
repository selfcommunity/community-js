import {useEffect, useMemo, useState} from 'react';
import http from '../utils/http';
import {Logger} from '../utils/logger';
import Endpoints from '../constants/Endpoints';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {SCFeedDiscussionType, SCFeedObjectType, SCFeedObjectTypologyType, SCFeedPostType, SCFeedStatusType} from '../types';

/**
 :::info
 This custom hook is used to fetch a feed object.
 :::
 * @param object
 * @param object.id
 * @param object.feedObject
 * @param object.feedObjectType
 */
export default function useSCFetchFeedObject({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST || SCFeedObjectTypologyType.DISCUSSION || SCFeedObjectTypologyType.STATUS,
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType: SCFeedObjectTypologyType;
}) {
  const [obj, setObj] = useState<SCFeedDiscussionType | SCFeedPostType | SCFeedStatusType>(feedObject);
  const [error, setError] = useState<string>(null);

  /**
   * Memoized fetchFeedObject
   */
  const fetchFeedObject = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.FeedObject.url({type: feedObjectType, id: id}),
          method: Endpoints.FeedObject.method,
        })
        .then((res: AxiosResponse<any>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id, feedObjectType]
  );

  /**
   * If id and feedObjectType resolve feddObject
   */
  useEffect(() => {
    if (id && feedObjectType) {
      fetchFeedObject()
        .then((obj) => {
          setObj(obj);
        })
        .catch((err) => {
          setError(`FeedObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, `FeedObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {obj, setObj, error};
}
