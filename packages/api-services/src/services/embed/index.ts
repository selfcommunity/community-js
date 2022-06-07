import {BaseGetParams, EmbedSearchParams, EmbedUpdateParams, SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCEmbedType, SCFeedUnitType} from '@selfcommunity/types';

export interface EmbedApiClientInterface {
  getAllEmbeds(params?: BaseGetParams): Promise<SCPaginatedResponse<SCEmbedType>>;
  createEmbed(data: SCEmbedType): Promise<SCEmbedType>;
  searchEmbed(params?: EmbedSearchParams): Promise<SCPaginatedResponse<SCEmbedType>>;
  getSpecificEmbed(id: number): Promise<SCEmbedType>;
  updateASpecificEmbed(id: number, data?: EmbedUpdateParams): Promise<SCEmbedType>;
  patchASpecificEmbed(id: number, data?: EmbedUpdateParams): Promise<SCEmbedType>;
  getEmbedFeed(embed_type?: string, embed_id?: string): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getSpecificEmbedFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>>;
}
/**
 * Contains all the endpoints needed to manage embeds.
 */

export class EmbedApiClient {
  /**
   * This endpoint retrieves all embeds.
   * @param params
   */
  static getAllEmbeds(params?: BaseGetParams): Promise<SCPaginatedResponse<SCEmbedType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.EmbedList.url({})}?${p.toString()}`, Endpoints.EmbedList.method);
  }

  /**
   * This endpoint creates an embed. This operation requires admin role.
   * @param data
   */
  static createEmbed(data: SCEmbedType): Promise<SCEmbedType> {
    return apiRequest(Endpoints.EmbedCreate.url({}), Endpoints.EmbedCreate.method, data);
  }

  /**
   * This endpoint performs embed search.
   * @param params
   */
  static searchEmbed(params?: EmbedSearchParams): Promise<SCPaginatedResponse<SCEmbedType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.EmbedSearch.url({})}?${p.toString()}`, Endpoints.EmbedSearch.method);
  }

  /**
   * This endpoint retrieves a specific embed using ID.
   * @param id
   */
  static getSpecificEmbed(id: number): Promise<SCEmbedType> {
    return apiRequest(Endpoints.Embed.url({id}), Endpoints.Embed.method);
  }

  /**
   * This endpoint updates a specific embed. This operation requires admin role.
   * @param id
   * @param data
   */
  static updateASpecificEmbed(id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return apiRequest(Endpoints.UpdateEmbed.url({id}), Endpoints.UpdateEmbed.method, data);
  }

  /**
   * This endpoint patches a specific embed. This operation requires admin role.
   * @param id
   * @param data
   */
  static patchASpecificEmbed(id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return apiRequest(Endpoints.PatchEmbed.url({id}), Endpoints.PatchEmbed.method, data);
  }

  /**
   * This endpoint retrieves the embed's feed which contains Feed that has the Embed as associated media.
   * @param embed_type
   * @param embed_id
   */
  static getEmbedFeed(embed_type?: string, embed_id?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    const p = new URLSearchParams({embed_type: embed_type, embed_id: embed_id});
    return apiRequest(`${Endpoints.EmbedFeed.url({})}?${p.toString()}`, Endpoints.EmbedFeed.method);
  }

  /**
   * This endpoint retrieves the embed's feed which contains Feed that has an Embed as associated media.
   * @param id
   */
  static getSpecificEmbedFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.SpecificEmbedFeed.url({id}), Endpoints.SpecificEmbedFeed.method);
  }
}

export default class EmbedService {
  static async getAllEmbeds(params?: BaseGetParams): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.getAllEmbeds(params);
  }

  static async searchEmbed(params?: EmbedSearchParams): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.searchEmbed(params);
  }

  static async createEmbed(data: SCEmbedType): Promise<SCEmbedType> {
    return EmbedApiClient.createEmbed(data);
  }

  static async getSpecificEmbed(id: number): Promise<SCEmbedType> {
    return EmbedApiClient.getSpecificEmbed(id);
  }

  static async updateASpecificEmbed(id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return EmbedApiClient.updateASpecificEmbed(id, data);
  }

  static async patchASpecificEmbed(id: number, data?: EmbedUpdateParams): Promise<SCEmbedType> {
    return EmbedApiClient.patchASpecificEmbed(id, data);
  }

  static async getEmbedFeed(embed_type?: string, embed_id?: string): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getEmbedFeed(embed_type, embed_id);
  }

  static async getSpecificEmbedFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getSpecificEmbedFeed(id);
  }
}
