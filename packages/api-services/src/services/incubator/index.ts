import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface IncubatorApiClientInterface {
  getAllIncubators(): Promise<any>;
  searchIncubators(): Promise<any>;
  getSpecificIncubator(id: number): Promise<any>;
  createIncubator(): Promise<any>;
  getIncubatorSubscribers(id: number): Promise<any>;
  subscribeToIncubator(id: number): Promise<any>;
  checkIncubatorSubscription(id: number): Promise<any>;
}

export class IncubatorApiClient {
  static getAllIncubators(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetAllIncubators.url({}),
        method: Endpoints.GetAllIncubators.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve incubators (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve incubators.');
        return Promise.reject(error);
      });
  }

  static searchIncubators(): Promise<any> {
    return client
      .request({
        url: Endpoints.SearchIncubators.url({}),
        method: Endpoints.SearchIncubators.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve incubators (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve incubators.');
        return Promise.reject(error);
      });
  }

  static getSpecificIncubator(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetASpecificIncubator.url({id}),
        method: Endpoints.GetASpecificIncubator.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve incubator (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve incubator.');
        return Promise.reject(error);
      });
  }

  static createIncubator(): Promise<any> {
    return client
      .request({
        url: Endpoints.CreateAnIncubator.url({}),
        method: Endpoints.CreateAnIncubator.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getIncubatorSubscribers(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetIncubatorSubscribers.url({id}),
        method: Endpoints.GetIncubatorSubscribers.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve incubator subscribers (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve incubator subscribers.');
        return Promise.reject(error);
      });
  }

  static subscribeToIncubator(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.SubscribeToIncubator.url({id}),
        method: Endpoints.SubscribeToIncubator.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static checkIncubatorSubscription(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckIncubatorSubscription.url({id}),
        method: Endpoints.CheckIncubatorSubscription.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve result (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve result.');
        return Promise.reject(error);
      });
  }
}

export default class IncubatorService {
  static async getAllIncubators(): Promise<any> {
    return IncubatorApiClient.getAllIncubators();
  }

  static async searchIncubators(): Promise<any> {
    return IncubatorApiClient.searchIncubators();
  }

  static async getSpecificIncubator(id: number): Promise<any> {
    return IncubatorApiClient.getSpecificIncubator(id);
  }
  static async createIncubator(): Promise<any> {
    return IncubatorApiClient.createIncubator();
  }

  static async getIncubatorSubscribers(id: number): Promise<any> {
    return IncubatorApiClient.getIncubatorSubscribers(id);
  }

  static async subscribeToIncubator(id: number): Promise<any> {
    return IncubatorApiClient.subscribeToIncubator(id);
  }

  static async checkIncubatorSubscription(id: number): Promise<any> {
    return IncubatorApiClient.checkIncubatorSubscription(id);
  }
}
