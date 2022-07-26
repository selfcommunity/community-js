import Endpoints from '../../constants/Endpoints';
import {SCCategoryType, SCCategoryAudienceType, SCUserType, SCFeedUnitType, SCCategoryFollowedStatusType} from '@selfcommunity/types';
import {BaseGetParams, CategoryParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';

export interface CategoryApiClientInterface {
  getAllCategories(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>>;
  searchCategory(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>>;
  createCategory(data: SCCategoryType): Promise<SCCategoryType>;
  getSpecificCategory(id: number): Promise<SCCategoryType>;
  updateASpecificCategory(id: number, data: SCCategoryType): Promise<SCCategoryType>;
  patchASpecificCategory(id: number, data: SCCategoryType): Promise<SCCategoryType>;
  deleteASpecificCategory(id: number): Promise<any>;
  getCategoryAudience(id: number): Promise<SCCategoryAudienceType>;
  getCategoryFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>>;
  getCategoryFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getCategoryTrendingFeed(id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getCategoryTrendingFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>>;
  followCategory(id: number): Promise<any>;
  checkCategoryIsFollowed(id: number): Promise<SCCategoryFollowedStatusType>;
  getFollowedCategories(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>>;
  getPopularCategories(params?: BaseGetParams): Promise<SCPaginatedResponse<SCCategoryType>>;
}

/**
 * Contains all the endpoints needed to manage categories.
 */
export class CategoryApiClient {
  /**
   * This endpoint retrieves all categories.
   * @param params
   */
  static getAllCategories(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CategoryList.url({})}?${p.toString()}`, Endpoints.CategoryList.method);
  }

  /**
   * This endpoint performs category search.
   * @param params
   */
  static searchCategory(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.SearchCategory.url({})}?${p.toString()}`, Endpoints.SearchCategory.method);
  }

  /**
   * This endpoint creates a category.
   * @param data
   */
  static createCategory(data: SCCategoryType): Promise<SCCategoryType> {
    return apiRequest(Endpoints.CreateCategory.url({}), Endpoints.CreateCategory.method, data);
  }

  /**
   * This endpoint retrieves a specific category.
   * @param id
   */
  static getSpecificCategory(id: number): Promise<SCCategoryType> {
    return apiRequest(Endpoints.Category.url({id}), Endpoints.Category.method);
  }

  /**
   * This endpoint updates a specific category.
   * @param id
   * @param data
   */
  static updateASpecificCategory(id: number, data: SCCategoryType): Promise<SCCategoryType> {
    return apiRequest(Endpoints.UpdateCategory.url({id}), Endpoints.UpdateCategory.method, data);
  }

  /**
   * This endpoint patches a specific category.
   * @param id
   * @param data
   */
  static patchASpecificCategory(id: number, data: SCCategoryType): Promise<SCCategoryType> {
    return apiRequest(Endpoints.PatchCategory.url({id}), Endpoints.PatchCategory.method, data);
  }

  /**
   * This endpoint deletes a specific category identified by {id}.
   * @param id
   */
  static deleteASpecificCategory(id: number): Promise<any> {
    return apiRequest(Endpoints.DeleteCategory.url({id}), Endpoints.DeleteCategory.method);
  }

  /**
   * This endpoint returns the audience of a specific category.
   * @param id
   */
  static getCategoryAudience(id: number): Promise<SCCategoryAudienceType> {
    return apiRequest(Endpoints.CategoryAudience.url({id}), Endpoints.CategoryAudience.method);
  }

  /**
   * This endpoint returns all followers of a specific category.
   * @param id
   */
  static getCategoryFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.CategoryFollowers.url({id}), Endpoints.CategoryFollowers.method);
  }

  /**
   * This endpoint retrieves the category feed.
   * @param id
   */
  static getCategoryFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.CategoryFeed.url({id}), Endpoints.CategoryFeed.method);
  }

  /**
   * This endpoint retrieves the category trending feed.
   * @param id
   * @param params
   */
  static getCategoryTrendingFeed(id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CategoryTrendingFeed.url({id})}?${p.toString()}`, Endpoints.CategoryTrendingFeed.method);
  }

  /**
   * This endpoint returns all trending followers of a specific category during last n days (default 90) .
   * @param id
   */
  static getCategoryTrendingFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest(Endpoints.CategoryTrendingPeople.url({id}), Endpoints.CategoryTrendingPeople.method);
  }

  /**
   * This endpoint follows a category.
   * @param id
   */
  static followCategory(id: number): Promise<any> {
    return apiRequest(Endpoints.FollowCategory.url({id}), Endpoints.FollowCategory.method);
  }

  /**
   * This endpoint returns is_followed = true if the category (identified in path) is followed by the authenticated user.
   * @param id
   */
  static checkCategoryIsFollowed(id: number): Promise<SCCategoryFollowedStatusType> {
    return apiRequest(Endpoints.CheckCategoryIsFollowed.url({id}), Endpoints.CheckCategoryIsFollowed.method);
  }

  /**
   * This endpoint retrieves all followed categories by the user.
   * @param params
   */
  static getFollowedCategories(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.CategoriesFollowed.url({})}?${p.toString()}`, Endpoints.CategoriesFollowed.method);
  }

  /**
   * This endpoint retrieves all categories ordered by the number of followers (in descending order).
   * @param params
   */
  static getPopularCategories(params?: BaseGetParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.PopularCategories.url({})}?${p.toString()}`, Endpoints.PopularCategories.method);
  }
}

export default class CategoryService {
  /**
   *  :::tipCategory service can be used in the following ways:
   *
   *  ```jsx
   *  1. Import the service from our library:
   *
   *  import {CategoryService} from "@selfcommunity/api-services";
   *  ```
   *  ```jsx
   *  2. Create a function and put the service inside it!
   *  The async function `getAllCategories` will return the paginated list of categories.
   *
   *     async getAllCategories() {
   *       return await CategoryService.getAllCategories();
   *     }
   *  ```
   *  ```jsx
   *  - In case of required `params`, just add them inside the brackets.
   *
   *    async getSpecificCategory(categoryId) {
   *       return await CategoryService.getSpecificCategory(categoryId);
   *     }
   *  ```
   *  :::
   */
  static async getAllCategories(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getAllCategories(params);
  }

  static async searchCategory(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.searchCategory(params);
  }

  static async createCategory(data: SCCategoryType): Promise<SCCategoryType> {
    return CategoryApiClient.createCategory(data);
  }

  static async getSpecificCategory(id: number): Promise<SCCategoryType> {
    return CategoryApiClient.getSpecificCategory(id);
  }

  static async updateASpecificCategory(id: number, data: SCCategoryType): Promise<SCCategoryType> {
    return CategoryApiClient.updateASpecificCategory(id, data);
  }

  static async patchASpecificCategory(id: number, data: SCCategoryType): Promise<SCCategoryType> {
    return CategoryApiClient.patchASpecificCategory(id, data);
  }

  static async deleteASpecificCategory(id: number): Promise<any> {
    return CategoryApiClient.deleteASpecificCategory(id);
  }

  static async getCategoryAudience(id: number): Promise<SCCategoryAudienceType> {
    return CategoryApiClient.getCategoryAudience(id);
  }

  static async getCategoryFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>> {
    return CategoryApiClient.getCategoryFollowers(id);
  }

  static async getCategoryFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return CategoryApiClient.getCategoryFeed(id);
  }

  static async getCategoryTrendingFeed(id: number, params?: BaseGetParams): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return CategoryApiClient.getCategoryTrendingFeed(id, params);
  }

  static async getCategoryTrendingFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>> {
    return CategoryApiClient.getCategoryTrendingFollowers(id);
  }

  static async followCategory(id: number): Promise<any> {
    return CategoryApiClient.followCategory(id);
  }

  static async checkCategoryIsFollowed(id: number): Promise<SCCategoryFollowedStatusType> {
    return CategoryApiClient.checkCategoryIsFollowed(id);
  }

  static async getFollowedCategories(params?: CategoryParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getFollowedCategories(params);
  }

  static async getPopularCategories(params?: BaseGetParams): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getPopularCategories(params);
  }
}
