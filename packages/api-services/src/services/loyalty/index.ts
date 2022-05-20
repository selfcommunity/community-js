import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface LoyaltyApiClientInterface {
  getPrizes(): Promise<any>;
  createPrize(): Promise<any>;
  getSpecificPrize(id: number): Promise<any>;
  updatePrize(id: number): Promise<any>;
  patchPrize(id: number): Promise<any>;
  getPrizeRequests(): Promise<any>;
  createPrizeRequest(): Promise<any>;
  getSpecificPrizeRequest(id: number): Promise<any>;
  patchPrizeRequest(id: number): Promise<any>;
}

export class LoyaltyApiClient {
  static getPrizes(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetPrizes.url({}),
        method: Endpoints.GetPrizes.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve prizes (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve prizes.');
        return Promise.reject(error);
      });
  }

  static createPrize(): Promise<any> {
    return client
      .request({
        url: Endpoints.CreatePrize.url({}),
        method: Endpoints.CreatePrize.method
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

  static getSpecificPrize(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetSpecificPrize.url({id}),
        method: Endpoints.GetSpecificPrize.method
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

  static updatePrize(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UpdatePrize.url({id}),
        method: Endpoints.UpdatePrize.method
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

  static patchPrize(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.PatchPrize.url({id}),
        method: Endpoints.PatchPrize.method
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

  static getPrizeRequests(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetPrizeRequests.url({}),
        method: Endpoints.GetPrizeRequests.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve prize requests (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve prize requests.');
        return Promise.reject(error);
      });
  }

  static createPrizeRequest(): Promise<any> {
    return client
      .request({
        url: Endpoints.CreatePrizeRequest.url({}),
        method: Endpoints.CreatePrizeRequest.method
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

  static getSpecificPrizeRequest(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetSpecificPrizeRequest.url({id}),
        method: Endpoints.GetSpecificPrizeRequest.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve prize request (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve prize request.');
        return Promise.reject(error);
      });
  }

  static patchPrizeRequest(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.PatchPrizeRequest.url({id}),
        method: Endpoints.PatchPrizeRequest.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action(Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }
}

export default class LoyaltyService {
  static async getPrizes(): Promise<any> {
    return LoyaltyApiClient.getPrizes();
  }

  static async createPrize(): Promise<any> {
    return LoyaltyApiClient.createPrize();
  }

  static async getSpecificPrize(id: number): Promise<any> {
    return LoyaltyApiClient.getSpecificPrize(id);
  }

  static async updatePrize(id: number): Promise<any> {
    return LoyaltyApiClient.updatePrize(id);
  }

  static async patchPrize(id: number): Promise<any> {
    return LoyaltyApiClient.patchPrize(id);
  }

  static async getPrizeRequests(): Promise<any> {
    return LoyaltyApiClient.getPrizeRequests();
  }

  static async createPrizeRequest(): Promise<any> {
    return LoyaltyApiClient.createPrizeRequest();
  }

  static async getSpecificPrizeRequest(id: number): Promise<any> {
    return LoyaltyApiClient.getSpecificPrizeRequest(id);
  }
  static async patchPrizeRequest(id: number): Promise<any> {
    return LoyaltyApiClient.patchPrizeRequest(id);
  }
}
