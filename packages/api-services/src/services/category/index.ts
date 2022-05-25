import Endpoints from '../../constants/Endpoints';
import {SCCategoryType, SCCategoryAudienceType, SCUserType, SCFeedUnitType, SCCategoryFollowedStatusType} from '@selfcommunity/types';
import {SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';

export interface CategoryApiClientInterface {
  getAllCategories(): Promise<SCPaginatedResponse<SCCategoryType>>;
  searchCategory(): Promise<SCPaginatedResponse<SCCategoryType>>;
  createCategory(): Promise<SCCategoryType>;
  getSpecificCategory(id: number): Promise<SCCategoryType>;
  updateASpecificCategory(id: number): Promise<SCCategoryType>;
  patchASpecificCategory(id: number): Promise<SCCategoryType>;
  deleteASpecificCategory(id: number): Promise<any>;
  getCategoryAudience(id: number): Promise<SCCategoryAudienceType>;
  getCategoryFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>>;
  getCategoryFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getCategoryTrendingFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getCategoryTrendingFollowers(id: number): Promise<SCPaginatedResponse<SCUserType>>;
  followCategory(id: number): Promise<any>;
  checkCategoryIsFollowed(id: number): Promise<SCCategoryFollowedStatusType>;
  getFollowedCategories(): Promise<SCPaginatedResponse<SCCategoryType>>;
  getPopularCategories(): Promise<SCPaginatedResponse<SCCategoryType>>;
}

/**
 * Contains all the endpoints needed to manage categories.
 */
export class CategoryApiClient {
  /**
   * This endpoint retrieves all categories.
   */
  static getAllCategories(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return apiRequest(Endpoints.CategoryList.url({}), Endpoints.CategoryList.method);
  }

  /**
   * This endpoint performs category search.
   */
  static searchCategory(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return apiRequest(Endpoints.SearchCategory.url({}), Endpoints.SearchCategory.method);
  }

  /**
   * This endpoint creates a category.
   */
  static createCategory(): Promise<SCCategoryType> {
    return apiRequest(Endpoints.CreateCategory.url({}), Endpoints.CreateCategory.method);
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
   */
  static updateASpecificCategory(id: number): Promise<SCCategoryType> {
    return apiRequest(Endpoints.UpdateCategory.url({id}), Endpoints.UpdateCategory.method);
  }

  /**
   * This endpoint patches a specific category.
   * @param id
   */
  static patchASpecificCategory(id: number): Promise<SCCategoryType> {
    return apiRequest(Endpoints.PatchCategory.url({id}), Endpoints.PatchCategory.method);
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
   */
  static getCategoryTrendingFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.CategoryTrendingFeed.url({id}), Endpoints.CategoryTrendingFeed.method);
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
   */
  static getFollowedCategories(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return apiRequest(Endpoints.CategoriesFollowed.url({}), Endpoints.CategoriesFollowed.method);
  }

  /**
   * This endpoint retrieves all categories ordered by the number of followers (in descending order).
   */
  static getPopularCategories(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return apiRequest(Endpoints.PopularCategories.url({}), Endpoints.PopularCategories.method);
  }
}

export default class CategoryService {
  static async getAllCategories(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getAllCategories();
  }

  static async searchCategory(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.searchCategory();
  }

  static async createCategory(): Promise<SCCategoryType> {
    return CategoryApiClient.createCategory();
  }

  static async getSpecificCategory(id: number): Promise<SCCategoryType> {
    return CategoryApiClient.getSpecificCategory(id);
  }

  static async updateASpecificCategory(id: number): Promise<SCCategoryType> {
    return CategoryApiClient.updateASpecificCategory(id);
  }

  static async patchASpecificCategory(id: number): Promise<SCCategoryType> {
    return CategoryApiClient.patchASpecificCategory(id);
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

  static async getCategoryTrendingFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return CategoryApiClient.getCategoryTrendingFeed(id);
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

  static async getFollowedCategories(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getFollowedCategories();
  }

  static async getPopularCategories(): Promise<SCPaginatedResponse<SCCategoryType>> {
    return CategoryApiClient.getPopularCategories();
  }
}
