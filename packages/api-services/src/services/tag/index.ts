import {apiRequest} from '../../utils/apiRequest';
import {TagParams, SCPaginatedResponse, TagGetParams} from '../../types';
import Endpoints from '../../constants/Endpoints';
import {SCTagType} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface TagApiClientInterface {
  getAllTags(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>>;
  createTag(data: TagParams, config?: AxiosRequestConfig): Promise<SCTagType>;
  searchTag(params?: TagGetParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCTagType>>;
  getSpecificTag(id: number | string, config?: AxiosRequestConfig): Promise<SCTagType>;
  updateTag(id: number | string, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType>;
  patchTag(id: number | string, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType>;
  assignATag(id: number | string, user?: number, category?: number, config?: AxiosRequestConfig): Promise<SCTagType>;
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
    const p = urlParams(params);
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
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.SearchTag.url({})}?${p.toString()}`, method: Endpoints.SearchTag.method});
  }

  /**
   * This endpoint retrieves a specific tag.
   * @param id
   * @param config
   */
  static getSpecificTag(id: number | string, config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({...config, url: Endpoints.Tag.url({id}), method: Endpoints.Tag.method});
  }

  /**
   * This endpoint updates a specific tag.
   * @param id
   * @param data
   * @param config
   */
  static updateTag(id: number | string, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return apiRequest({...config, url: Endpoints.UpdateTag.url({id}), method: Endpoints.UpdateTag.method, data: data ?? null});
  }

  /**
   * This endpoint patches a specific tag.
   * @param id
   * @param data
   * @param config
   */
  static patchTag(id: number | string, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
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
  static assignATag(id: number | string, user?: number, category?: number, config?: AxiosRequestConfig): Promise<SCTagType> {
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
 :::tipTag service can be used in the following way:

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
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
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
  static async getSpecificTag(id: number | string, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.getSpecificTag(id, config);
  }
  static async updateTag(id: number | string, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.updateTag(id, data, config);
  }
  static async patchTag(id: number | string, data?: TagParams, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.patchTag(id, data, config);
  }
  static async assignATag(id: number | string, user?: number, category?: number, config?: AxiosRequestConfig): Promise<SCTagType> {
    return TagApiClient.assignATag(id, user, category, config);
  }
}
