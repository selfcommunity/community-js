import Endpoints from '../../constants/Endpoints';
import {SCCategoryType, SCCategoryAudienceType, SCUserType, SCFeedUnitType, SCCategoryFollowedStatusType} from '@selfcommunity/types';
import {BaseGetParams, CategoryParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface CategoryApiClientInterface {
  getAllCategories(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>>;
  searchCategory(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>>;
  createCategory(data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType>;
  getSpecificCategory(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryType>;
  updateASpecificCategory(id: number | string, data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType>;
  patchASpecificCategory(id: number | string, data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType>;
  deleteASpecificCategory(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  getCategoryAudience(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryAudienceType>;
  getCategoryFollowers(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  getCategoryFeed(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getCategoryTrendingFeed(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getCategoryTrendingFollowers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
  followCategory(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  checkCategoryIsFollowed(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryFollowedStatusType>;
  getFollowedCategories(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>>;
  getPopularCategories(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>>;
}

/**
 * Contains all the endpoints needed to manage categories.
 */
export class CategoryApiClient {
  /**
   * This endpoint retrieves all categories.
   * @param params
   * @param config
   */
  static getAllCategories(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = urlParams(params);
    return apiRequest({url: `${Endpoints.CategoryList.url({})}?${p.toString()}`, method: Endpoints.CategoryList.method, ...config});
  }

  /**
   * This endpoint performs category search.
   * @param params
   * @param config
   */
  static searchCategory(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = urlParams(params);
    return apiRequest({url: `${Endpoints.SearchCategory.url({})}?${p.toString()}`, method: Endpoints.SearchCategory.method, ...config});
  }

  /**
   * This endpoint creates a category.
   * @param data
   * @param config
   */
  static createCategory(data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return apiRequest({url: Endpoints.CreateCategory.url({}), method: Endpoints.CreateCategory.method, data: data, ...config});
  }

  /**
   * This endpoint retrieves a specific category.
   * @param id
   * @param config
   */
  static getSpecificCategory(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return apiRequest({url: Endpoints.Category.url({id}), method: Endpoints.Category.method, ...config});
  }

  /**
   * This endpoint updates a specific category.
   * @param id
   * @param data
   * @param config
   */
  static updateASpecificCategory(id: number | string, data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return apiRequest({url: Endpoints.UpdateCategory.url({id}), method: Endpoints.UpdateCategory.method, data: data, ...config});
  }

  /**
   * This endpoint patches a specific category.
   * @param id
   * @param data
   * @param config
   */
  static patchASpecificCategory(id: number | string, data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return apiRequest({url: Endpoints.PatchCategory.url({id}), method: Endpoints.PatchCategory.method, data: data, ...config});
  }

  /**
   * This endpoint deletes a specific category identified by {id}.
   * @param id
   * @param config
   */
  static deleteASpecificCategory(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({url: Endpoints.DeleteCategory.url({id}), method: Endpoints.DeleteCategory.method, ...config});
  }

  /**
   * This endpoint returns the audience of a specific category.
   * @param id
   * @param config
   */
  static getCategoryAudience(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryAudienceType> {
    return apiRequest({url: Endpoints.CategoryAudience.url({id}), method: Endpoints.CategoryAudience.method, ...config});
  }

  /**
   * This endpoint returns all followers of a specific category.
   * @param id
   * @param config
   */
  static getCategoryFollowers(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({url: Endpoints.CategoryFollowers.url({id}), method: Endpoints.CategoryFollowers.method, params, ...config});
  }

  /**
   * This endpoint retrieves the category feed.
   * @param id
   * @param config
   */
  static getCategoryFeed(id: number | string, params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest({url: Endpoints.CategoryFeed.url({id}), method: Endpoints.CategoryFeed.method, params, ...config});
  }

  /**
   * This endpoint retrieves the category trending feed.
   * @param id
   * @param params
   * @param config
   */
  static getCategoryTrendingFeed(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = urlParams(params);
    return apiRequest({url: `${Endpoints.CategoryTrendingFeed.url({id})}?${p.toString()}`, method: Endpoints.CategoryTrendingFeed.method, ...config});
  }

  /**
   * This endpoint returns all trending followers of a specific category during last n days (default 90) .
   * @param id
   * @param config
   */
  static getCategoryTrendingFollowers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({url: Endpoints.CategoryTrendingPeople.url({id}), method: Endpoints.CategoryTrendingPeople.method, params, ...config});
  }

  /**
   * This endpoint follows a category.
   * @param id
   * @param config
   */
  static followCategory(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({url: Endpoints.FollowCategory.url({id}), method: Endpoints.FollowCategory.method, ...config});
  }

  /**
   * This endpoint returns is_followed = true if the category (identified in path) is followed by the authenticated user.
   * @param id
   * @param config
   */
  static checkCategoryIsFollowed(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryFollowedStatusType> {
    return apiRequest({url: Endpoints.CheckCategoryIsFollowed.url({id}), method: Endpoints.CheckCategoryIsFollowed.method, ...config});
  }

  /**
   * This endpoint retrieves all followed categories by the user.
   * @param params
   * @param config
   */
  static getFollowedCategories(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = urlParams(params);
    return apiRequest({url: `${Endpoints.CategoriesFollowed.url({})}?${p.toString()}`, method: Endpoints.CategoriesFollowed.method, ...config});
  }

  /**
   * This endpoint retrieves all categories ordered by the number of followers (in descending order).
   * @param params
   * @param config
   */
  static getPopularCategories(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.PopularCategories.url({})}?${p.toString()}`, method: Endpoints.PopularCategories.method});
  }
}

/**
 *
 :::tipCategory service can be used in the following way:
 ```jsx
 1. Import the service from our library:

 import {CategoryService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllCategories` will return the paginated list of categories.

 async getAllCategories() {
       return await CategoryService.getAllCategories();
     }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificCategory(categoryId) {
      return await CategoryService.getSpecificCategory(categoryId);
     }
 ```
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class CategoryService {
  static async getAllCategories(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getAllCategories(params, config);
  }

  static async searchCategory(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.searchCategory(params, config);
  }

  static async createCategory(data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return CategoryApiClient.createCategory(data, config);
  }

  static async getSpecificCategory(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return CategoryApiClient.getSpecificCategory(id, config);
  }

  static async updateASpecificCategory(id: number | string, data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return CategoryApiClient.updateASpecificCategory(id, data, config);
  }

  static async patchASpecificCategory(id: number | string, data: SCCategoryType, config?: AxiosRequestConfig): Promise<SCCategoryType> {
    return CategoryApiClient.patchASpecificCategory(id, data, config);
  }

  static async deleteASpecificCategory(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CategoryApiClient.deleteASpecificCategory(id, config);
  }

  static async getCategoryAudience(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryAudienceType> {
    return CategoryApiClient.getCategoryAudience(id, config);
  }

  static async getCategoryFollowers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CategoryApiClient.getCategoryFollowers(id, params, config);
  }

  static async getCategoryFeed(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return CategoryApiClient.getCategoryFeed(id, params, config);
  }

  static async getCategoryTrendingFeed(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return CategoryApiClient.getCategoryTrendingFeed(id, params, config);
  }

  static async getCategoryTrendingFollowers(
    id: number | string,
    params?: BaseGetParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCUserType>> {
    return CategoryApiClient.getCategoryTrendingFollowers(id, params, config);
  }

  static async followCategory(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CategoryApiClient.followCategory(id, config);
  }

  static async checkCategoryIsFollowed(id: number | string, config?: AxiosRequestConfig): Promise<SCCategoryFollowedStatusType> {
    return CategoryApiClient.checkCategoryIsFollowed(id, config);
  }

  static async getFollowedCategories(params?: CategoryParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getFollowedCategories(params, config);
  }

  static async getPopularCategories(params?: BaseGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getPopularCategories(params, config);
  }
}
