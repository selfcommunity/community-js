import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface CategoryApiClientInterface {
  getAllCategories(): Promise<any>;
  getSpecificCategory(id: number): Promise<any>;
}

export class CategoryApiClient {
  static getAllCategories(): Promise<any> {
    return client
      .request({
        url: Endpoints.Category.url({}),
        method: Endpoints.Category.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve categories (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve categories.');
        return Promise.reject(error);
      });
  }

  static getSpecificCategory(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Category.url({id}),
        method: Endpoints.User.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve category (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve category.');
        return Promise.reject(error);
      });
  }
}

export default class CategoryService {
  static async getAllCategories(): Promise<any> {
    return CategoryApiClient.getAllCategories();
  }

  static async getSpecificCategory(id: number): Promise<any> {
    return CategoryApiClient.getSpecificCategory(id);
  }
}
