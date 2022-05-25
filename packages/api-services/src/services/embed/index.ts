import {SCPaginatedResponse} from '../../types';
import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCEmbedType, SCFeedUnitType} from '@selfcommunity/types';

export interface EmbedApiClientInterface {
  getAllEmbeds(): Promise<SCPaginatedResponse<SCEmbedType>>;
  createEmbed(): Promise<SCEmbedType>;
  searchEmbed(): Promise<SCPaginatedResponse<SCEmbedType>>;
  getSpecificEmbed(id: number): Promise<SCEmbedType>;
  updateASpecificEmbed(id: number): Promise<SCEmbedType>;
  patchASpecificEmbed(id: number): Promise<SCEmbedType>;
  getEmbedFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>>;
  getSpecificEmbedFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>>;
}

export class EmbedApiClient {
  /**
   * This endpoint retrieves all embeds.
   */
  static getAllEmbeds(): Promise<SCPaginatedResponse<SCEmbedType>> {
    return apiRequest(Endpoints.EmbedList.url({}), Endpoints.EmbedList.method);
  }

  /**
   * This endpoint creates an embed.
   */
  static createEmbed(): Promise<SCEmbedType> {
    return apiRequest(Endpoints.EmbedCreate.url({}), Endpoints.EmbedCreate.method);
  }

  /**
   * This endpoint performs embed search.
   */
  static searchEmbed(): Promise<SCPaginatedResponse<SCEmbedType>> {
    return apiRequest(Endpoints.EmbedSearch.url({}), Endpoints.EmbedSearch.method);
  }

  /**
   * This endpoint retrieves a specific embed using ID.
   * @param id
   */
  static getSpecificEmbed(id: number): Promise<SCEmbedType> {
    return apiRequest(Endpoints.Embed.url({id}), Endpoints.Embed.method);
  }

  /**
   * This endpoint updates a specific embed.
   * @param id
   */
  static updateASpecificEmbed(id: number): Promise<SCEmbedType> {
    return apiRequest(Endpoints.UpdateEmbed.url({id}), Endpoints.UpdateEmbed.method);
  }

  /**
   * This endpoint patches a specific embed.
   * @param id
   */
  static patchASpecificEmbed(id: number): Promise<SCEmbedType> {
    return apiRequest(Endpoints.PatchEmbed.url({id}), Endpoints.PatchEmbed.method);
  }

  /**
   * This endpoint retrieves the embed's feed which contains Feed that has the Embed as associated media.
   */
  static getEmbedFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return apiRequest(Endpoints.EmbedFeed.url({}), Endpoints.EmbedFeed.method);
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
  static async getAllEmbeds(): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.getAllEmbeds();
  }

  static async searchEmbed(): Promise<SCPaginatedResponse<SCEmbedType>> {
    return EmbedApiClient.searchEmbed();
  }

  static async createEmbed(): Promise<SCEmbedType> {
    return EmbedApiClient.createEmbed();
  }

  static async getSpecificEmbed(id: number): Promise<SCEmbedType> {
    return EmbedApiClient.getSpecificEmbed(id);
  }

  static async updateASpecificEmbed(id: number): Promise<SCEmbedType> {
    return EmbedApiClient.updateASpecificEmbed(id);
  }

  static async patchASpecificEmbed(id: number): Promise<SCEmbedType> {
    return EmbedApiClient.patchASpecificEmbed(id);
  }

  static async getEmbedFeed(): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getEmbedFeed();
  }

  static async getSpecificEmbedFeed(id: number): Promise<SCPaginatedResponse<SCFeedUnitType>> {
    return EmbedApiClient.getSpecificEmbedFeed(id);
  }
}
