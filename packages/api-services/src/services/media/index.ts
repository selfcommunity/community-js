import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCChunkMediaType, SCMediaType} from '@selfcommunity/types';
import {ChunkUploadCompleteParams, ChunkUploadParams, MediaCreateParams} from '../../types';

export interface MediaApiClientInterface {
  chunkUploadMedia(data: ChunkUploadParams): Promise<SCChunkMediaType>;
  chunkUploadMediaComplete(data: ChunkUploadCompleteParams): Promise<SCMediaType>;
  createMedia(data: MediaCreateParams): Promise<SCMediaType>;
  clickMedia(id: number, ip?: string): Promise<any>;
  getSpecificMedia(id: number): Promise<SCMediaType>;
  updateMedia(id: number, image: string): Promise<SCMediaType>;
  deleteMedia(id: number): Promise<any>;
}
/**
 * Contains all the endpoints needed to manage medias.
 */
export class MediaApiClient {
  /**
   * This endpoint performs the chunk upload of a media with type image or document.
   * The client must split the file into chunks and send to the server in series. After all the chunks have been uploaded the client must call the Chunk Upload Complete endpoint with the given upload_id parameter to finalize the upload and retrieve the Media.
   *  To perform chunk upload the request must contain Content-Range header with the information about the chunk.
   * @param data
   */
  static chunkUploadMedia(data: ChunkUploadParams): Promise<SCChunkMediaType> {
    return apiRequest(
      Endpoints.ComposerChunkUploadMedia.url({}),
      Endpoints.ComposerChunkUploadMedia.method,
      {'Content-Range': 'bytes 1433600-1638399/2124437'},
      data
    );
  }

  /**
   * This endpoint completes the chunk upload and create the media.
   * @param data
   */
  static chunkUploadMediaComplete(data: ChunkUploadCompleteParams): Promise<SCMediaType> {
    return apiRequest(Endpoints.ComposerChunkUploadMediaComplete.url({}), Endpoints.ComposerChunkUploadMediaComplete.method, data);
  }

  /**
   * This endpoint creates a media.
   * @param data
   */
  static createMedia(data: MediaCreateParams): Promise<SCMediaType> {
    return apiRequest(Endpoints.ComposerMediaCreate.url({}), Endpoints.ComposerMediaCreate.method, data);
  }

  /**
   * This endpoint saves a click on a specific media using ID.
   * @param id
   * @param ip
   */
  static clickMedia(id: number, ip?: string): Promise<any> {
    return apiRequest(Endpoints.MediaClickTracker.url({id}), Endpoints.MediaClickTracker.method, {ip: ip} ?? null);
  }

  /**
   * This endpoint retrieves a specific media using ID.
   * @param id
   */
  static getSpecificMedia(id: number): Promise<SCMediaType> {
    return apiRequest(Endpoints.GetMedia.url({id}), Endpoints.GetMedia.method);
  }

  /**
   * This endpoint updates a media.
   * @param id
   * @param image
   */
  static updateMedia(id: number, image: string): Promise<SCMediaType> {
    return apiRequest(Endpoints.UpdateMedia.url({id}), Endpoints.UpdateMedia.method, {image: image});
  }

  /**
   * This endpoint deletes a media.
   * @param id
   */
  static deleteMedia(id: number): Promise<any> {
    return apiRequest(Endpoints.DeleteMedia.url({id}), Endpoints.DeleteMedia.method);
  }
}

export default class MediaService {
  static async chunkUploadMedia(data: ChunkUploadParams): Promise<SCChunkMediaType> {
    return MediaApiClient.chunkUploadMedia(data);
  }

  static async chunkUploadMediaComplete(data: ChunkUploadCompleteParams): Promise<SCMediaType> {
    return MediaApiClient.chunkUploadMediaComplete(data);
  }

  static async createMedia(data: MediaCreateParams): Promise<SCMediaType> {
    return MediaApiClient.createMedia(data);
  }

  static async clickMedia(id: number, ip?: string): Promise<any> {
    return MediaApiClient.clickMedia(id, ip);
  }

  static async getSpecificMedia(id: number): Promise<SCMediaType> {
    return MediaApiClient.getSpecificMedia(id);
  }

  static async updateMedia(id: number, image: string): Promise<SCMediaType> {
    return MediaApiClient.updateMedia(id, image);
  }

  static async deleteMedia(id: number): Promise<any> {
    return MediaApiClient.deleteMedia(id);
  }
}
