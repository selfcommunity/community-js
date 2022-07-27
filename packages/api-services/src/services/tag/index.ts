import {apiRequest} from '../../utils/apiRequest';
import {TagParams, SCPaginatedResponse, TagGetParams} from '../../types';
import Endpoints from '../../constants/Endpoints';
import {SCTagType} from '@selfcommunity/types/src/types';

export interface TagApiClientInterface {
  getAllTags(params?: TagGetParams): Promise<SCPaginatedResponse<SCTagType>>;
  createTag(data: TagParams): Promise<SCTagType>;
  searchTag(params?: TagGetParams): Promise<SCPaginatedResponse<SCTagType>>;
  getSpecificTag(id: number): Promise<SCTagType>;
  updateTag(id: number, data?: TagParams): Promise<SCTagType>;
  patchTag(id: number, data?: TagParams): Promise<SCTagType>;
  assignATag(id: number, user?: number, category?: number): Promise<SCTagType>;
}
/**
 * Contains all the endpoints needed to manage tags.
 * All endpoints require admin role.
 */
export class TagApiClient {
  /**
   * This endpoint retrieves all tags.
   * @param params
   */
  static getAllTags(params?: TagGetParams): Promise<SCPaginatedResponse<SCTagType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.TagsList.url({})}?${p.toString()}`, Endpoints.TagsList.method);
  }

  /**
   * This endpoint creates a tag
   * @param data
   */
  static createTag(data: TagParams): Promise<SCTagType> {
    return apiRequest(Endpoints.CreateTag.url({}), Endpoints.CreateTag.method, data);
  }

  /**
   * This endpoint performs tag search.
   * @param params
   */
  static searchTag(params?: TagGetParams): Promise<SCPaginatedResponse<SCTagType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.SearchTag.url({})}?${p.toString()}`, Endpoints.SearchTag.method);
  }

  /**
   * This endpoint retrieves a specific tag.
   * @param id
   */
  static getSpecificTag(id: number): Promise<SCTagType> {
    return apiRequest(Endpoints.Tag.url({id}), Endpoints.Tag.method);
  }

  /**
   * This endpoint updates a specific tag.
   * @param id
   * @param data
   */
  static updateTag(id: number, data?: TagParams): Promise<SCTagType> {
    return apiRequest(Endpoints.UpdateTag.url({id}), Endpoints.UpdateTag.method, data ?? null);
  }

  /**
   * This endpoint patches a specific tag.
   * @param id
   * @param data
   */
  static patchTag(id: number, data?: TagParams): Promise<SCTagType> {
    return apiRequest(Endpoints.PatchTag.url({id}), Endpoints.PatchTag.method, data ?? null);
  }

  /**
   * This endpoint assigns a tag to a user or to a category.
   * One param between "user" and "category" need to be passed to this endpoint.
   * @param id
   * @param user
   * @param category
   */
  static assignATag(id: number, user?: number, category?: number): Promise<SCTagType> {
    return apiRequest(Endpoints.AssignTag.url({id}), Endpoints.AssignTag.method, user ? {user: user} : {category: category});
  }
}

export default class TagService {
  /**
   *  :::tipTag service can be used in the following ways:
   *
   *  ```jsx
   *  1. Import the service from our library:
   *
   *  import {TagService} from "@selfcommunity/api-services";
   *  ```
   *  ```jsx
   *  2. Create a function and put the service inside it!
   *  The async function `getAllTags` will return the paginated list of tags.
   *
   *     async getAllTags() {
   *       return await TagService.getAllTags();
   *     }
   *  ```
   *  ```jsx
   *  - In case of required `params`, just add them inside the brackets.
   *
   *    async getSpecificTag(tagId) {
   *       return await TagService.getSpecificTag(tagId);
   *     }
   *  ```
   *  :::
   */
  static async getAllTags(params?: TagGetParams): Promise<SCPaginatedResponse<SCTagType>> {
    return TagApiClient.getAllTags(params);
  }
  static async createTag(data: TagParams): Promise<SCTagType> {
    return TagApiClient.createTag(data);
  }
  static async searchTag(params?: TagGetParams): Promise<SCPaginatedResponse<SCTagType>> {
    return TagApiClient.searchTag(params);
  }
  static async getSpecificTag(id: number): Promise<SCTagType> {
    return TagApiClient.getSpecificTag(id);
  }
  static async updateTag(id: number, data?: TagParams): Promise<SCTagType> {
    return TagApiClient.updateTag(id, data);
  }
  static async patchTag(id: number, data?: TagParams): Promise<SCTagType> {
    return TagApiClient.patchTag(id, data);
  }
  static async assignATag(id: number, user?: number, category?: number): Promise<SCTagType> {
    return TagApiClient.assignATag(id, user, category);
  }
}
