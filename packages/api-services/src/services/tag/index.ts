import {apiRequest} from '../../utils/apiRequest';
import {TagParams, SCPaginatedResponse, TagGetParams} from '../../types';
import Endpoints from '../../constants/Endpoints';
import {SCTagType} from '@selfcommunity/types/src/types';
import {AxiosRequestConfig} from 'axios';

export interface TagApiClientInterface {
  getAllTags(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>>;
  createTag(data: TagParams, config?: AxiosRequestConfig): Promise<SCTagType>;
  searchTag(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>>;
  getSpecificTag(id: number, config?: AxiosRequestConfig): Promise<SCTagType>;
  updateTag(id: number, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType>;
  patchTag(id: number, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType>;
  assignATag(id: number, user?: number, category?: number, config?: AxiosRequestConfig): Promise<SCTagType>;
}
/**
 * Contains all the endpoints needed to manage tags.
 * All endpoints require admin role.
 */
export class TagApiClient {
  /**
   * This endpoint retrieves all tags.
   * @param params
   * @param config
   */
  static getAllTags(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.TagsList.url({})}?${p.toString()}`, method: Endpoints.TagsList.method});
  }

  /**
   * This endpoint creates a tag
   * @param data
   * @param config
   */
  static createTag(data: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({...config, url: Endpoints.CreateTag.url({}), method: Endpoints.CreateTag.method, data: data});
  }

  /**
   * This endpoint performs tag search.
   * @param params
   * @param config
   */
  static searchTag(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>> {
    const p = new URLSearchParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchTag.url({})}?${p.toString()}`, method: Endpoints.SearchTag.method});
  }

  /**
   * This endpoint retrieves a specific tag.
   * @param id
   * @param config
   */
  static getSpecificTag(id: number, config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({...config, url: Endpoints.Tag.url({id}), method: Endpoints.Tag.method});
  }

  /**
   * This endpoint updates a specific tag.
   * @param id
   * @param data
   * @param config
   */
  static updateTag(id: number, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({...config, url: Endpoints.UpdateTag.url({id}), method: Endpoints.UpdateTag.method, data: data ?? null});
  }

  /**
   * This endpoint patches a specific tag.
   * @param id
   * @param data
   * @param config
   */
  static patchTag(id: number, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({...config, url: Endpoints.PatchTag.url({id}), method: Endpoints.PatchTag.method, data: data ?? null});
  }

  /**
   * This endpoint assigns a tag to a user or to a category.
   * One param between "user" and "category" need to be passed to this endpoint.
   * @param id
   * @param user
   * @param category
   * @param config
   */
  static assignATag(id: number, user?: number, category?: number, config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({
      ...config,
      url: Endpoints.AssignTag.url({id}),
      method: Endpoints.AssignTag.method,
      data: user ? {user: user} : {category: category}
    });
  }
}

/**
 *
 :::tipTag service can be used in the following ways:

 ```jsx
 1. Import the service from our library:

 import {TagService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllTags` will return the paginated list of tags.

 async getAllTags() {
        return await TagService.getAllTags();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getSpecificTag(tagId) {
       return await TagService.getSpecificTag(tagId);
      }
 ```
 :::
 */
export default class TagService {
  static async getAllTags(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>> {
    return TagApiClient.getAllTags(params, config);
  }
  static async createTag(data: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.createTag(data, config);
  }
  static async searchTag(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>> {
    return TagApiClient.searchTag(params, config);
  }
  static async getSpecificTag(id: number, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.getSpecificTag(id, config);
  }
  static async updateTag(id: number, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.updateTag(id, data, config);
  }
  static async patchTag(id: number, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.patchTag(id, data, config);
  }
  static async assignATag(id: number, user?: number, category?: number, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.assignATag(id, user, category, config);
  }
}
