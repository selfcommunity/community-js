import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface TagApiClientInterface {
  getAllTags(): Promise<any>;
  createTag(): Promise<any>;
  searchTag(): Promise<any>;
  getSpecificTag(id: number): Promise<any>;
  updateTag(id: number): Promise<any>;
  patchTag(id: number): Promise<any>;
  assignATag(id: number): Promise<any>;
}

export class TagApiClient {
  static getAllTags(): Promise<any> {
    return client
      .request({
        url: Endpoints.TagsList.url({}),
        method: Endpoints.TagsList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve.');
        return Promise.reject(error);
      });
  }
  static createTag(): Promise<any> {
    return client
      .request({
        url: Endpoints.CreateTag.url({}),
        method: Endpoints.CreateTag.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve.');
        return Promise.reject(error);
      });
  }

  static searchTag(): Promise<any> {
    return client
      .request({
        url: Endpoints.SearchTag.url({}),
        method: Endpoints.SearchTag.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve.');
        return Promise.reject(error);
      });
  }

  static getSpecificTag(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Tag.url({id}),
        method: Endpoints.Tag.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve.');
        return Promise.reject(error);
      });
  }

  static updateTag(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UpdateTag.url({id}),
        method: Endpoints.UpdateTag.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve.');
        return Promise.reject(error);
      });
  }

  static patchTag(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.PatchTag.url({id}),
        method: Endpoints.PatchTag.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve.');
        return Promise.reject(error);
      });
  }
  static assignATag(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.AssignTag.url({id}),
        method: Endpoints.AssignTag.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve  (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve.');
        return Promise.reject(error);
      });
  }
}

export default class TagService {
  static async getAllTags(): Promise<any> {
    return TagApiClient.getAllTags();
  }
  static async createTag(): Promise<any> {
    return TagApiClient.createTag();
  }
  static async searchTag(): Promise<any> {
    return TagApiClient.searchTag();
  }
  static async getSpecificTag(id: number): Promise<any> {
    return TagApiClient.getSpecificTag(id);
  }
  static async updateTag(id: number): Promise<any> {
    return TagApiClient.updateTag(id);
  }
  static async patchTag(id: number): Promise<any> {
    return TagApiClient.patchTag(id);
  }
  static async assignATag(id: number): Promise<any> {
    return TagApiClient.assignATag(id);
  }
}
