import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {
  MessageChunkUploadDoneParams,
  MessageCreateParams,
  MessageMediaChunksParams,
  MessageMediaUploadParams,
  MessageThumbnailUploadParams,
  SCPaginatedResponse,
  ThreadParams
} from '../../types';
import {
  SCPrivateMessageType,
  SCPrivateMessageUploadMediaChunkType,
  SCPrivateMessageUploadMediaType,
  SCPrivateMessageUploadThumbnailType
} from '@selfcommunity/types';

export interface PrivateMessageApiClientInterface {
  getAllSnippets(): Promise<SCPaginatedResponse<SCPrivateMessageType>>;
  getAThread(data: ThreadParams): Promise<SCPaginatedResponse<SCPrivateMessageType>>;
  getASingleMessage(id: number): Promise<SCPrivateMessageType>;
  sendAMessage(data: MessageCreateParams): Promise<SCPrivateMessageType>;
  deleteAMessage(id: number): Promise<any>;
  deleteAThread(id: number): Promise<any>;
  uploadMedia(data: MessageMediaUploadParams): Promise<SCPrivateMessageUploadMediaType>;
  uploadThumbnail(data: MessageThumbnailUploadParams): Promise<SCPrivateMessageUploadThumbnailType>;
  uploadMediaInChunks(data: MessageMediaChunksParams): Promise<SCPrivateMessageUploadMediaChunkType>;
  chunkUploadDone(data: MessageChunkUploadDoneParams): Promise<SCPrivateMessageUploadMediaType>;
}
/**
 * Contains all the endpoints needed to manage private messages.
 */

export class PrivateMessageApiClient {
  /**
   * This endpoint retrieves all snippets.
   */
  static getAllSnippets(): Promise<SCPaginatedResponse<SCPrivateMessageType>> {
    return apiRequest(Endpoints.GetSnippets.url({}), Endpoints.GetSnippets.method);
  }

  /**
   * This endpoint retrieves all messages in a thread.
   * @param data
   */
  static getAThread(data: ThreadParams): Promise<SCPaginatedResponse<SCPrivateMessageType>> {
    return apiRequest(Endpoints.GetAThread.url({}), Endpoints.GetAThread.method, data);
  }

  /**
   * This endpoint retrieves a single message using ID.
   * @param id
   */
  static getASingleMessage(id: number): Promise<SCPrivateMessageType> {
    return apiRequest(Endpoints.GetASingleMessage.url({id}), Endpoints.GetASingleMessage.method);
  }

  /**
   * This endpoint sends a message.
   * @param data
   */
  static sendAMessage(data: MessageCreateParams): Promise<SCPrivateMessageType> {
    return apiRequest(Endpoints.SendMessage.url({}), Endpoints.SendMessage.method, data);
  }

  /**
   * This endpoint deletes a single message.
   * @param id
   */
  static deleteAMessage(id: number): Promise<any> {
    return apiRequest(Endpoints.DeleteASingleMessage.url({id}), Endpoints.DeleteASingleMessage.method);
  }

  /**
   * This endpoint deletes a thread.
   * @param id
   */
  static deleteAThread(id: number): Promise<any> {
    return apiRequest(Endpoints.DeleteAThread.url({id}), Endpoints.DeleteAThread.method);
  }

  /**
   * This endpoint uploads a media.
   * @param data
   */
  static uploadMedia(data: MessageMediaUploadParams): Promise<SCPrivateMessageUploadMediaType> {
    return apiRequest(Endpoints.PrivateMessageUploadMedia.url({}), Endpoints.PrivateMessageUploadMedia.method, data);
  }

  /**
   * This endpoint uploads a thumbnail.
   * @param data
   */
  static uploadThumbnail(data: MessageThumbnailUploadParams): Promise<SCPrivateMessageUploadThumbnailType> {
    return apiRequest(Endpoints.PrivateMessageUploadThumbnail.url({}), Endpoints.PrivateMessageUploadThumbnail.method, data);
  }

  /**
   * This endpoint performs the chunk upload of a file.
   * @param data
   */
  static uploadMediaInChunks(data: MessageMediaChunksParams): Promise<SCPrivateMessageUploadMediaChunkType> {
    return apiRequest(Endpoints.PrivateMessageUploadMediaInChunks.url({}), Endpoints.PrivateMessageUploadMediaInChunks.method, data);
  }

  /**
   * This endpoint finalizes the chunk upload and creates the file.
   * @param data
   */
  static chunkUploadDone(data: MessageChunkUploadDoneParams): Promise<SCPrivateMessageUploadMediaType> {
    return apiRequest(Endpoints.PrivateMessageChunkUploadDone.url({}), Endpoints.PrivateMessageChunkUploadDone.method, data);
  }
}

export default class PrivateMessageService {
  /**
   *  :::tipPrivateMessage service can be used in the following ways:
   *
   *  ```jsx
   *  1. Import the service from our library:
   *
   *  import {PrivateMessageService} from "@selfcommunity/api-services";
   *  ```
   *  ```jsx
   *  2. Create a function and put the service inside it!
   *  The async function `getAllSnippets` will return the paginated list of snippets.
   *
   *     async getAllSnippets() {
   *       return await PrivateMessageService.getAllSnippets();
   *     }
   *  ```
   *  ```jsx
   *  - In case of required `params`, just add them inside the brackets.
   *
   *    async getASingleMessage(messageId) {
   *       return await PrivateMessageService.getASingleMessage(messageId);
   *     }
   *  ```
   *  :::
   */
  static async getAllSnippets(): Promise<SCPaginatedResponse<SCPrivateMessageType>> {
    return PrivateMessageApiClient.getAllSnippets();
  }
  static async getAThread(data: ThreadParams): Promise<SCPaginatedResponse<SCPrivateMessageType>> {
    return PrivateMessageApiClient.getAThread(data);
  }
  static async getASingleMessage(id: number): Promise<SCPrivateMessageType> {
    return PrivateMessageApiClient.getASingleMessage(id);
  }
  static async sendAMessage(data: MessageCreateParams): Promise<SCPrivateMessageType> {
    return PrivateMessageApiClient.sendAMessage(data);
  }
  static async deleteAMessage(id: number): Promise<any> {
    return PrivateMessageApiClient.deleteAMessage(id);
  }
  static async deleteAThread(id: number): Promise<any> {
    return PrivateMessageApiClient.deleteAThread(id);
  }
  static async uploadMedia(data: MessageMediaUploadParams): Promise<SCPrivateMessageUploadMediaType> {
    return PrivateMessageApiClient.uploadMedia(data);
  }
  static async uploadThumbnail(data: MessageThumbnailUploadParams): Promise<SCPrivateMessageUploadThumbnailType> {
    return PrivateMessageApiClient.uploadThumbnail(data);
  }
  static async uploadMediaInChunks(data: MessageMediaChunksParams): Promise<SCPrivateMessageUploadMediaChunkType> {
    return PrivateMessageApiClient.uploadMediaInChunks(data);
  }
  static async chunkUploadDone(data: MessageChunkUploadDoneParams): Promise<SCPrivateMessageUploadMediaType> {
    return PrivateMessageApiClient.chunkUploadDone(data);
  }
}
