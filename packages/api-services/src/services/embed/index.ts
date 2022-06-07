import {BaseGetParams, EmbedSearchParams, EmbedUpdateParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCEmbedType, SCFeedUnitType} from '@selfcommunity/types';

export interface EmbedApiClientInterface {
  getAllEmbeds(params?: BaseGetParams, token?: string): Promise<SCPaginatedResponse<SCEmbedType>>;
  createEmbed(token: string, data: SCEmbedType): Promise<SCEmbedType>;
  searchEmbed(params?: EmbedSearchParams, token?: string): Promise<SCPaginatedResponse<SCEmbedType>>;
  getSpecificEmbed(id: number, token?: string): Promise<SCEmbedType>;
  updateASpecificEmbed(token: string, id: number, data?: EmbedUpdateParams): Promise<SCEmbedType>;
  patchASpecificEmbed(token: string, id: number, data?: EmbedUpdateParams): Promise<SCEmbedType>;
  getEmbedFeed(token?: string, embed_type?: string, embed_id?: string): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getSpecificEmbedFeed(id: number, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>>;
}
/**
 * Contains all the endpoints needed to manage embeds.
 */

export class EmbedApiClient {
  /**
   * This endpoint retrieves all embeds.
   * @param params
   * @param token
   */
  static getAllEmbeds(params?: BaseGetParams, token?: string): Promise<SCPaginatedResponse<SCEmbedType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.EmbedList.url({})}?${p.toString()}`, Endpoints.EmbedList.method, token);
  }

  /**
   * This endpoint creates an embed. This operation requires admin role.
   * @param token
   * @param data
   */
  static createEmbed(token: string, data: SCEmbedType): Promise<SCEmbedType> {
    return apiRequest(Endpoints.EmbedCreate.url({}), Endpoints.EmbedCreate.method, token, data);
  }

  /**
   * This endpoint performs embed search.
   * @param params
   * @param token
   */
  static searchEmbed(params?: EmbedSearchParams, token?: string): Promise<SCPaginatedResponse<SCEmbedType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.EmbedSearch.url({})}?${p.toString()}`, Endpoints.EmbedSearch.method, token);
  }

  /**
   * This endpoint retrieves a specific embed using ID.
   * @param id
   * @param token
   */
  static getSpecificEmbed(id: number, token?: string): Promise<SCEmbedType> {
    return apiRequest(Endpoints.Embed.url({id}), Endpoints.Embed.method, token);
  }

  /**
   * This endpoint updates a specific embed. This operation requires admin role.
   * @param token
   * @param id
   * @param data
   */
  static updateASpecificEmbed(token: string, id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return apiRequest(Endpoints.UpdateEmbed.url({id}), Endpoints.UpdateEmbed.method, token, data);
  }

  /**
   * This endpoint patches a specific embed. This operation requires admin role.
   * @param token
   * @param id
   * @param data
   */
  static patchASpecificEmbed(token: string, id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return apiRequest(Endpoints.PatchEmbed.url({id}), Endpoints.PatchEmbed.method, token, data);
  }

  /**
   * This endpoint retrieves the embed's feed which contains Feed that has the Embed as associated media.
   * @param token
   * @param embed_type
   * @param embed_id
   */
  static getEmbedFeed(token?: string, embed_type?: string, embed_id?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams({embed_type: embed_type, embed_id: embed_id});
    return apiRequest(`${Endpoints.EmbedFeed.url({})}?${p.toString()}`, Endpoints.EmbedFeed.method, token);
  }

  /**
   * This endpoint retrieves the embed's feed which contains Feed that has an Embed as associated media.
   * @param id
   * @param token
   */
  static getSpecificEmbedFeed(id: number, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.SpecificEmbedFeed.url({id}), Endpoints.SpecificEmbedFeed.method, token);
  }
}

export default class EmbedService {
  static async getAllEmbeds(params?: BaseGetParams, token?: string): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.getAllEmbeds(params, token);
  }

  static async searchEmbed(params?: EmbedSearchParams, token?: string): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.searchEmbed(params, token);
  }

  static async createEmbed(token: string, data: SCEmbedType): Promise<SCEmbedType> {
    return EmbedApiClient.createEmbed(token, data);
  }

  static async getSpecificEmbed(id: number, token?: string): Promise<SCEmbedType> {
    return EmbedApiClient.getSpecificEmbed(id, token);
  }

  static async updateASpecificEmbed(token: string, id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return EmbedApiClient.updateASpecificEmbed(token, id, data);
  }

  static async patchASpecificEmbed(token: string, id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return EmbedApiClient.patchASpecificEmbed(token, id, data);
  }

  static async getEmbedFeed(token?: string, embed_type?: string, embed_id?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getEmbedFeed(token, embed_type, embed_id);
  }

  static async getSpecificEmbedFeed(id: number, token?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getSpecificEmbedFeed(id, token);
  }
}
