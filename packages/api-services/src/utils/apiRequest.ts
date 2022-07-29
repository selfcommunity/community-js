import client from '../client';
import {AxiosRequestConfig} from 'axios';

export function apiRequest(config: AxiosRequestConfig) {
  return client
    .request(config)
    .then((res: any) => {
      if (res.status >= 300) {
        console.log(`Unable to ${config.method} ${config.url} (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      console.log(`Unable to ${config.method} ${config.url} ${error}`);
      return Promise.reject(error);
    });
}
