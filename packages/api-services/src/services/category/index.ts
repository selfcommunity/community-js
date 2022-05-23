import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface CategoryApiClientInterface {
  getAllCategories(): Promise<any>;
  searchCategory(): Promise<any>;
  createCategory(): Promise<any>;
  getSpecificCategory(id: number): Promise<any>;
  updateASpecificCategory(id: number): Promise<any>;
  patchASpecificCategory(id: number): Promise<any>;
  deleteASpecificCategory(id: number): Promise<any>;
  getCategoryAudience(id: number): Promise<any>;
  getCategoryFollowers(id: number): Promise<any>;
  getCategoryFeed(id: number): Promise<any>;
  getCategoryTrendingFeed(id: number): Promise<any>;
  getCategoryTrendingFollowers(id: number): Promise<any>;
  followCategory(id: number): Promise<any>;
  checkCategoryIsFollowed(id: number): Promise<any>;
  getFollowedCategories(): Promise<any>;
  getPopularCategories(): Promise<any>;
}

export class CategoryApiClient {
  static getAllCategories(): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoryList.url({}),
        method: Endpoints.CategoryList.method
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

  static searchCategory(): Promise<any> {
    return client
      .request({
        url: Endpoints.SearchCategory.url({}),
        method: Endpoints.SearchCategory.method
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

  static createCategory(): Promise<any> {
    return client
      .request({
        url: Endpoints.CreateCategory.url({}),
        method: Endpoints.CreateCategory.method
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

  static getSpecificCategory(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Category.url({id}),
        method: Endpoints.Category.method
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

  static updateASpecificCategory(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UpdateCategory.url({id}),
        method: Endpoints.UpdateCategory.method
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

  static patchASpecificCategory(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.PatchCategory.url({id}),
        method: Endpoints.PatchCategory.method
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
  static deleteASpecificCategory(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.DeleteCategory.url({id}),
        method: Endpoints.DeleteCategory.method
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

  static getCategoryAudience(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoryAudience.url({id}),
        method: Endpoints.CategoryAudience.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve category audience (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve category audience.');
        return Promise.reject(error);
      });
  }

  static getCategoryFollowers(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoryFollowers.url({id}),
        method: Endpoints.CategoryFollowers.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve category followers (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve category followers.');
        return Promise.reject(error);
      });
  }

  static getCategoryFeed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoryFeed.url({id}),
        method: Endpoints.CategoryFeed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve category feed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve category feed.');
        return Promise.reject(error);
      });
  }

  static getCategoryTrendingFeed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoryTrendingFeed.url({id}),
        method: Endpoints.CategoryTrendingFeed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve category trending feed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve category trending feed.');
        return Promise.reject(error);
      });
  }

  static getCategoryTrendingFollowers(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoryTrendingPeople.url({id}),
        method: Endpoints.CategoryTrendingPeople.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve category followers (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve category followers.');
        return Promise.reject(error);
      });
  }

  static followCategory(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FollowCategory.url({id}),
        method: Endpoints.FollowCategory.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform follow action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform follow action.');
        return Promise.reject(error);
      });
  }

  static checkCategoryIsFollowed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckCategoryIsFollowed.url({id}),
        method: Endpoints.CheckCategoryIsFollowed.method
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

  static getFollowedCategories(): Promise<any> {
    return client
      .request({
        url: Endpoints.CategoriesFollowed.url({}),
        method: Endpoints.CategoriesFollowed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve categories followed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve categories followed.');
        return Promise.reject(error);
      });
  }

  static getPopularCategories(): Promise<any> {
    return client
      .request({
        url: Endpoints.PopularCategories.url({}),
        method: Endpoints.PopularCategories.method
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
}

export default class CategoryService {
  static async getAllCategories(): Promise<any> {
    return CategoryApiClient.getAllCategories();
  }

  static async searchCategory(): Promise<any> {
    return CategoryApiClient.searchCategory();
  }

  static async createCategory(): Promise<any> {
    return CategoryApiClient.createCategory();
  }

  static async getSpecificCategory(id: number): Promise<any> {
    return CategoryApiClient.getSpecificCategory(id);
  }

  static async updateASpecificCategory(id: number): Promise<any> {
    return CategoryApiClient.updateASpecificCategory(id);
  }

  static async patchASpecificCategory(id: number): Promise<any> {
    return CategoryApiClient.patchASpecificCategory(id);
  }

  static async deleteASpecificCategory(id: number): Promise<any> {
    return CategoryApiClient.deleteASpecificCategory(id);
  }

  static async getCategoryAudience(id: number): Promise<any> {
    return CategoryApiClient.getCategoryAudience(id);
  }

  static async getCategoryFollowers(id: number): Promise<any> {
    return CategoryApiClient.getCategoryFollowers(id);
  }

  static async getCategoryFeed(id: number): Promise<any> {
    return CategoryApiClient.getCategoryFeed(id);
  }

  static async getCategoryTrendingFeed(id: number): Promise<any> {
    return CategoryApiClient.getCategoryTrendingFeed(id);
  }

  static async getCategoryTrendingFollowers(id: number): Promise<any> {
    return CategoryApiClient.getCategoryTrendingFollowers(id);
  }

  static async followCategory(id: number): Promise<any> {
    return CategoryApiClient.followCategory(id);
  }

  static async checkCategoryIsFollowed(id: number): Promise<any> {
    return CategoryApiClient.checkCategoryIsFollowed(id);
  }

  static async getFollowedCategories(): Promise<any> {
    return CategoryApiClient.getFollowedCategories();
  }

  static async getPopularCategories(): Promise<any> {
    return CategoryApiClient.getPopularCategories();
  }
}
