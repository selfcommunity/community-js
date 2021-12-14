import {useEffect, useMemo, useState} from 'react';
import {
  http,
  Endpoints,
  Logger,
  SCFeedDiscussionType,
  SCFeedObjectType,
  SCFeedObjectTypologyType,
  SCFeedPostType,
  SCFeedStatusType,
  StringUtils,
} from '@selfcommunity/core';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';

/**
 * Custom hook 'useFetchFeedObject'
 * Use this hook to fetch a feed object
 * @param id
 * @param feedObject
 * @param feedObjectType
 */
export default function useSCFetchFeedObject({
  id = null,
  feedObject = null,
  feedObjectType = SCFeedObjectTypologyType.POST,
}: {
  id?: number;
  feedObject?: SCFeedObjectType;
  feedObjectType: SCFeedObjectTypologyType;
}) {
  const [obj, setObj] = useState<SCFeedDiscussionType | SCFeedPostType | SCFeedStatusType>(feedObject);

  /**
   * Memoized fetchFeedObject
   */
  const fetchFeedObject = useMemo(
    () => () => {
      const type = StringUtils.capitalize(feedObjectType);
      return http
        .request({
          url: Endpoints.FeedObject.url({type, id: id}),
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
          Logger.error(SCOPE_SC_CORE, `FeedObject with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {obj, setObj};
}
