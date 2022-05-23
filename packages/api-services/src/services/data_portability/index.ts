import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface DataPortabilityApiClientInterface {
  generateDataPortability(): Promise<any>;
  downloadDataPortability(): Promise<any>;
  dataPortabilityStatus(): Promise<any>;
}

export class DataPortabilityApiClient {
  static generateDataPortability(): Promise<any> {
    return client
      .request({
        url: Endpoints.GenerateDataPortability.url({}),
        method: Endpoints.GenerateDataPortability.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to generate data (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to generate data.');
        return Promise.reject(error);
      });
  }

  static downloadDataPortability(): Promise<any> {
    return client
      .request({
        url: Endpoints.DataPortabilityDownload.url({}),
        method: Endpoints.DataPortabilityDownload.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to download data (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to download data.');
        return Promise.reject(error);
      });
  }

  static dataPortabilityStatus(): Promise<any> {
    return client
      .request({
        url: Endpoints.DataPortabilityStatus.url({}),
        method: Endpoints.DataPortabilityStatus.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve data status (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve data status.');
        return Promise.reject(error);
      });
  }
}

export default class DataPortabilityService {
  static async generateDataPortability(): Promise<any> {
    return DataPortabilityApiClient.generateDataPortability();
  }
  static async downloadDataPortability(): Promise<any> {
    return DataPortabilityApiClient.downloadDataPortability();
  }
  static async dataPortabilityStatus(): Promise<any> {
    return DataPortabilityApiClient.dataPortabilityStatus();
  }
}
