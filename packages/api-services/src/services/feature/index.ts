import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface FeatureApiClientInterface {
  getAllFeatures(): Promise<any>;
}

export class FeatureApiClient {
  static getAllFeatures(): Promise<any> {
    return client
      .request({
        url: Endpoints.Feature.url({}),
        method: Endpoints.Feature.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve community preferences (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        const data = res.data['results'].map((f) => f.name);
        return Promise.resolve(data);
      })
      .catch((error) => {
        console.log('Unable to retrieve features.');
        return Promise.reject(error);
      });
  }
}

export default class FeatureService {
  static async getAllFeatures(): Promise<any> {
    return FeatureApiClient.getAllFeatures();
  }
}
