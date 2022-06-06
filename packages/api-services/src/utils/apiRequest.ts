import client from '../client';

export function apiRequest(url: string, method: string, token?: string, data?: any) {
  client.setBasePortal(process.env.STORYBOOK_PLATFORM_URL);
  client.setAuthorizeToken(token);
  return client
    .request({
      url,
      method,
      data: data ?? null
    })
    .then((res: any) => {
      if (res.status >= 300) {
        console.log(`Unable to ${method} ${url} (Response code: ${res.status}).`);
        return Promise.reject(res);
      }
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      console.log(`Unable to ${method} ${url} ${error}`);
      return Promise.reject(error);
    });
}
