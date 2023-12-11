import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {
  MessageChunkUploadDoneParams,
  MessageCreateParams,
  MessageMediaChunksParams,
  MessageMediaUploadParams,
  MessageThumbnailUploadParams,
  SCPaginatedResponse,
  ThreadParams,
  ThreadDeleteParams
} from '../../types';
import {
  SCPrivateMessageSnippetType,
  SCPrivateMessageThreadType,
  SCPrivateMessageUploadMediaChunkType,
  SCPrivateMessageUploadMediaType,
  SCPrivateMessageUploadThumbnailType,
  SCUserType
} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface PrivateMessageApiClientInterface {
  getAllSnippets(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrivateMessageSnippetType>>;
  getAThread(params: ThreadParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrivateMessageThreadType>>;
  getASingleMessage(id: number | string, config?: AxiosRequestConfig): Promise<SCPrivateMessageThreadType>;
  sendAMessage(data: MessageCreateParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageThreadType>;
  deleteAMessage(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  deleteAThread(params: ThreadDeleteParams, config?: AxiosRequestConfig): Promise<any>;
  uploadMedia(data: MessageMediaUploadParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaType>;
  uploadThumbnail(data: MessageThumbnailUploadParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadThumbnailType>;
  uploadMediaInChunks(data: MessageMediaChunksParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaChunkType>;
  chunkUploadDone(data: MessageChunkUploadDoneParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaType>;
  searchUser(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>>;
}
/**
 * Contains all the endpoints needed to manage private messages.
 */

export class PrivateMessageApiClient {
  /**
   * This endpoint retrieves all snippets.
   * @param config
   */
  static getAllSnippets(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrivateMessageSnippetType>> {
    return apiRequest({...config, url: Endpoints.GetSnippets.url({}), method: Endpoints.GetSnippets.method});
  }

  /**
   * This endpoint retrieves all messages in a thread.
   * @param params
   * @param config
   */
  static getAThread(params: ThreadParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrivateMessageThreadType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.GetAThread.url({})}?${p.toString()}`, method: Endpoints.GetAThread.method});
  }

  /**
   * This endpoint retrieves a single message using ID.
   * @param id
   * @param config
   */
  static getASingleMessage(id: number | string, config?: AxiosRequestConfig): Promise<SCPrivateMessageThreadType> {
    return apiRequest({...config, url: Endpoints.GetASingleMessage.url({id}), method: Endpoints.GetASingleMessage.method});
  }

  /**
   * This endpoint sends a message.
   * @param data
   * @param config
   */
  static sendAMessage(data: MessageCreateParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageThreadType> {
    return apiRequest({...config, data, url: Endpoints.SendMessage.url({}), method: Endpoints.SendMessage.method});
  }

  /**
   * This endpoint deletes a single message.
   * @param id
   * @param config
   */
  static deleteAMessage(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteASingleMessage.url({id}), method: Endpoints.DeleteASingleMessage.method});
  }

  /**
   * This endpoint deletes a thread.
   * @param params
   * @param config
   */
  static deleteAThread(params: ThreadDeleteParams, config?: AxiosRequestConfig): Promise<any> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.DeleteAThread.url({})}?${p.toString()}`, method: Endpoints.DeleteAThread.method});
  }

  /**
   * This endpoint uploads a media.
   * @param data
   * @param config
   */
  static uploadMedia(data: MessageMediaUploadParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaType> {
    return apiRequest({...config, data, url: Endpoints.PrivateMessageUploadMedia.url({}), method: Endpoints.PrivateMessageUploadMedia.method});
  }

  /**
   * This endpoint uploads a thumbnail.
   * @param data
   * @param config
   */
  static uploadThumbnail(data: MessageThumbnailUploadParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadThumbnailType> {
    return apiRequest({
      ...config,
      data,
      url: Endpoints.PrivateMessageUploadThumbnail.url({}),
      method: Endpoints.PrivateMessageUploadThumbnail.method
    });
  }

  /**
   * This endpoint performs the chunk upload of a file.
   * @param data
   * @param config
   */
  static uploadMediaInChunks(data: MessageMediaChunksParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaChunkType> {
    return apiRequest({
      ...config,
      data,
      url: Endpoints.PrivateMessageUploadMediaInChunks.url({}),
      method: Endpoints.PrivateMessageUploadMediaInChunks.method
    });
  }

  /**
   * This endpoint finalizes the chunk upload and creates the file.
   * @param data
   * @param config
   */
  static chunkUploadDone(data: MessageChunkUploadDoneParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaType> {
    return apiRequest({
      ...config,
      url: Endpoints.PrivateMessageChunkUploadDone.url({}),
      method: Endpoints.PrivateMessageChunkUploadDone.method,
      data: data
    });
  }
  /**
   * This endpoint performs users search.
   * @param search
   * @param config
   */
  static searchUser(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return apiRequest({
      ...config,
      url: Endpoints.PrivateMessageSearchUser.url({search}),
      method: Endpoints.PrivateMessageSearchUser.method
    });
  }
}

/**
 *
 :::tip Private Message service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {PrivateMessageService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllSnippets` will return the paginated list of snippets.

 async getAllSnippets() {
        return await PrivateMessageService.getAllSnippets();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getASingleMessage(messageId) {
        return await PrivateMessageService.getASingleMessage(messageId);
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
export default class PrivateMessageService {
  static async getAllSnippets(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrivateMessageSnippetType>> {
    return PrivateMessageApiClient.getAllSnippets(config);
  }
  static async getAThread(params: ThreadParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCPrivateMessageThreadType>> {
    return PrivateMessageApiClient.getAThread(params, config);
  }
  static async getASingleMessage(id: number | string, config?: AxiosRequestConfig): Promise<SCPrivateMessageThreadType> {
    return PrivateMessageApiClient.getASingleMessage(id, config);
  }
  static async sendAMessage(data: MessageCreateParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageThreadType> {
    return PrivateMessageApiClient.sendAMessage(data, config);
  }
  static async deleteAMessage(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return PrivateMessageApiClient.deleteAMessage(id, config);
  }
  static async deleteAThread(params: ThreadDeleteParams, config?: AxiosRequestConfig): Promise<any> {
    return PrivateMessageApiClient.deleteAThread(params, config);
  }
  static async uploadMedia(data: MessageMediaUploadParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaType> {
    return PrivateMessageApiClient.uploadMedia(data, config);
  }
  static async uploadThumbnail(data: MessageThumbnailUploadParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadThumbnailType> {
    return PrivateMessageApiClient.uploadThumbnail(data, config);
  }
  static async uploadMediaInChunks(data: MessageMediaChunksParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaChunkType> {
    return PrivateMessageApiClient.uploadMediaInChunks(data, config);
  }
  static async chunkUploadDone(data: MessageChunkUploadDoneParams, config?: AxiosRequestConfig): Promise<SCPrivateMessageUploadMediaType> {
    return PrivateMessageApiClient.chunkUploadDone(data, config);
  }
  static async searchUser(search: string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserType>> {
    return PrivateMessageApiClient.searchUser(search, config);
  }
}
