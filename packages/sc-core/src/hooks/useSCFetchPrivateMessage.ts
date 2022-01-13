import {useEffect, useMemo, useState} from 'react';
import {AxiosResponse} from 'axios';
import {SCOPE_SC_CORE} from '../constants/Errors';
import {http, Endpoints, Logger, SCPrivateMessageType} from '@selfcommunity/core';

/**
 * Custom hook 'useSCFetchPrivateMessage'
 * Use this hook to fetch a message object
 * @param id
 */
export default function useSCFetchPrivateMessage({id = null, message = null}: {id?: number; message?: SCPrivateMessageType}) {
  const [scMessage, setSCMessage] = useState<SCPrivateMessageType>(message);

  /**
   * Memoized fetchPrivateMessage
   */
  const fetchPrivateMessage = useMemo(
    () => () => {
      return http
        .request({
          url: Endpoints.GetAThread.url(),
          method: Endpoints.GetAThread.method,
          params: {thread: id},
        })
        .then((res: AxiosResponse<SCPrivateMessageType>) => {
          if (res.status >= 300) {
            return Promise.reject(res);
          }
          return Promise.resolve(res.data);
        });
    },
    [id]
  );

  /**
   * If id attempt to get the message by id
   */
  useEffect(() => {
    if (id) {
      fetchPrivateMessage()
        .then((obj: SCPrivateMessageType) => {
          setSCMessage(obj);
        })
        .catch((err) => {
          Logger.error(SCOPE_SC_CORE, `Private Message with id ${id} not found`);
          Logger.error(SCOPE_SC_CORE, err.message);
        });
    }
  }, [id]);

  return {scMessage, setSCMessage};
}
