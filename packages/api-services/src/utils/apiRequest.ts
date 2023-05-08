import client from '../client';
import {AxiosRequestConfig} from 'axios';
import {SCOPE_API_SERVICES} from '../constants/Errors';
import {Logger} from '@selfcommunity/utils';

export function apiRequest(config: AxiosRequestConfig) {
  return client
    .request(config)
    .then((res: any) => {
      if (!res) {
        Logger.info(SCOPE_API_SERVICES, `Request ${config.method} ${config.url} aborted.`);
        return Promise.reject(res);
      }
      if (res.status >= 300) {
        Logger.info(SCOPE_API_SERVICES, `Unable to ${config.method} ${config.url} (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      Logger.warn(SCOPE_API_SERVICES, `Unable to ${config.method} ${config.url} ${error}`);
      return Promise.reject(error);
    });
}
