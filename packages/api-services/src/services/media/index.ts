import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCChunkMediaType, SCMediaType} from '@selfcommunity/types';
import {ChunkUploadCompleteParams, ChunkUploadParams, MediaCreateParams} from '../../types';
import {AxiosRequestConfig} from 'axios';

export interface MediaApiClientInterface {
  chunkUploadMedia(
    data: ChunkUploadParams,
    bytesStart: number,
    bytesEnd: number,
    bytesTotal: number,
    config?: AxiosRequestConfig
  ): Promise<SCChunkMediaType>;
  chunkUploadMediaComplete(data: ChunkUploadCompleteParams, config?: AxiosRequestConfig): Promise<SCMediaType>;
  createMedia(data: MediaCreateParams, config?: AxiosRequestConfig): Promise<SCMediaType>;
  clickMedia(id: number | string, ip?: string, config?: AxiosRequestConfig): Promise<any>;
  getSpecificMedia(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType>;
  updateMedia(id: number | string, image: string, config?: AxiosRequestConfig): Promise<SCMediaType>;
  deleteMedia(id: number | string, config?: AxiosRequestConfig): Promise<any>;
}
/**
 * Contains all the endpoints needed to manage medias.
 */
export class MediaApiClient {
  /**
   * This endpoint performs the chunk upload of a media with type image or document.
   * The client must split the file into chunks and send to the server in series. After all the chunks have been uploaded the client must call the Chunk Upload Complete endpoint with the given upload_id parameter to finalize the upload and retrieve the Media.
   *  To perform chunk upload the request must contain Content-Range header with the information about the chunk(range of the chunk upload in the format bytes start-end/total)
   * @param data
   * @param bytesStart
   * @param bytesEnd
   * @param bytesTotal
   * @param config
   */
  static chunkUploadMedia(
    data: ChunkUploadParams,
    bytesStart: number,
    bytesEnd: number,
    bytesTotal: number,
    config?: AxiosRequestConfig
  ): Promise<SCChunkMediaType> {
    return apiRequest({
      ...config,
      url: Endpoints.ComposerChunkUploadMedia.url({}),
      method: Endpoints.ComposerChunkUploadMedia.method,
      data: data,
      headers: {'Content-Range': `bytes ${bytesStart}-${bytesEnd}/${bytesTotal}`}
    });
  }

  /**
   * This endpoint completes the chunk upload and create the media.
   * @param data
   * @param config
   */
  static chunkUploadMediaComplete(data: ChunkUploadCompleteParams, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return apiRequest({
      ...config,
      url: Endpoints.ComposerChunkUploadMediaComplete.url({}),
      method: Endpoints.ComposerChunkUploadMediaComplete.method,
      data: data
    });
  }

  /**
   * This endpoint creates a media.
   * @param data
   * @param config
   */
  static createMedia(data: MediaCreateParams, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return apiRequest({...config, url: Endpoints.ComposerMediaCreate.url({}), method: Endpoints.ComposerMediaCreate.method, data: data});
  }

  /**
   * This endpoint saves a click on a specific media using ID.
   * @param id
   * @param ip
   * @param config
   */
  static clickMedia(id: number | string, ip?: string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.MediaClickTracker.url({id}), method: Endpoints.MediaClickTracker.method, data: {ip: ip} ?? null});
  }

  /**
   * This endpoint retrieves a specific media using ID.
   * @param id
   * @param config
   */
  static getSpecificMedia(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return apiRequest({...config, url: Endpoints.GetMedia.url({id}), method: Endpoints.GetMedia.method});
  }

  /**
   * This endpoint updates a media.
   * @param id
   * @param image
   * @param config
   */
  static updateMedia(id: number | string, image: string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return apiRequest({...config, url: Endpoints.UpdateMedia.url({id}), method: Endpoints.UpdateMedia.method, data: {image: image}});
  }

  /**
   * This endpoint deletes a media.
   * @param id
   * @param config
   */
  static deleteMedia(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteMedia.url({id}), method: Endpoints.DeleteMedia.method});
  }
}

/**
 *
 :::tipMedia service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {MediaService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `createMedia` will return the created media obj. It takes a media obj as body param.

 async createMedia() {
      const body = {url: 'string', type: 'url'};
        return await MediaService.createMedia(body);
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
export default class MediaService {
  static async chunkUploadMedia(
    data: ChunkUploadParams,
    bytesStart: number,
    bytesEnd: number,
    bytesTotal: number,
    config?: AxiosRequestConfig
  ): Promise<SCChunkMediaType> {
    return MediaApiClient.chunkUploadMedia(data, bytesStart, bytesEnd, bytesTotal, config);
  }

  static async chunkUploadMediaComplete(data: ChunkUploadCompleteParams, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return MediaApiClient.chunkUploadMediaComplete(data, config);
  }

  static async createMedia(data: MediaCreateParams, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return MediaApiClient.createMedia(data, config);
  }

  static async clickMedia(id: number | string, ip?: string, config?: AxiosRequestConfig): Promise<any> {
    return MediaApiClient.clickMedia(id, ip, config);
  }

  static async getSpecificMedia(id: number | string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return MediaApiClient.getSpecificMedia(id, config);
  }

  static async updateMedia(id: number | string, image: string, config?: AxiosRequestConfig): Promise<SCMediaType> {
    return MediaApiClient.updateMedia(id, image, config);
  }

  static async deleteMedia(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return MediaApiClient.deleteMedia(id, config);
  }
}
