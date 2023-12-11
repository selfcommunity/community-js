import Endpoints from '../../constants/Endpoints';
import {apiRequest} from '../../utils/apiRequest';
import {SCCommentType, SCFlagType, SCFlagTypeEnum, SCVoteType} from '@selfcommunity/types';
import {CommentCreateParams, CommentListParams, SCPaginatedResponse} from '../../types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface CommentApiClientInterface {
  getAllComments(params: CommentListParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCommentType>>;
  createComment(data: CommentCreateParams, config?: AxiosRequestConfig): Promise<SCCommentType>;
  getASpecificComment(id: number | string, config?: AxiosRequestConfig): Promise<SCCommentType>;
  updateComment(id: number | string, text: string, config?: AxiosRequestConfig): Promise<SCCommentType>;
  deleteComment(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  restoreComment(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  getSpecificCommentVotesList(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCVoteType>>;
  upvoteComment(id: number | string, config?: AxiosRequestConfig): Promise<any>;
  getSpecificCommentFlags(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>>;
  flagComment(id: number | string, flagType: SCFlagTypeEnum, config?: AxiosRequestConfig): Promise<any>;
  getSpecificCommentFlagStatus(id: number | string, config?: AxiosRequestConfig): Promise<SCFlagType>;
}

/**
 * Contains all the endpoints needed to manage comments.
 */

export class CommentApiClient {
  /**
   * This endpoint retrieves all comments.
   * @param params
   * @param config
   */
  static getAllComments(params: CommentListParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCommentType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.Comments.url({})}?${p.toString()}`, method: Endpoints.Comments.method});
  }

  /**
   * This endpoint creates a comment.
   * @param data
   * @param config
   */
  static createComment(data: CommentCreateParams, config?: AxiosRequestConfig): Promise<SCCommentType> {
    return apiRequest({...config, url: Endpoints.NewComment.url({}), method: Endpoints.NewComment.method, data: data});
  }

  /**
   * This endpoint retrieves a specific comment using ID.
   * @param id
   * @param config
   */
  static getASpecificComment(id: number | string, config?: AxiosRequestConfig): Promise<SCCommentType> {
    return apiRequest({...config, url: Endpoints.Comment.url({id}), method: Endpoints.Comment.method});
  }

  /**
   * This endpoint updates a specific comment. The logged user must be the comment creator.
   * @param id
   * @param text
   * @param config
   */
  static updateComment(id: number | string, text: string, config?: AxiosRequestConfig): Promise<SCCommentType> {
    return apiRequest({...config, url: Endpoints.UpdateComment.url({id}), method: Endpoints.UpdateComment.method, data: {text: text}});
  }

  /**
   * This endpoint deletes a specific comment using ID. The logged user must be the comment creator.
   * @param id
   * @param config
   */
  static deleteComment(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.DeleteComment.url({id}), method: Endpoints.DeleteComment.method});
  }

  /**
   * This endpoint restores a specific comment using ID. The logged user must be the comment creator.
   * @param id
   * @param config
   */
  static restoreComment(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.RestoreComment.url({id}), method: Endpoints.RestoreComment.method});
  }

  /**
   * This endpoint retrieves all votes for a specific comment.
   * @param id
   * @param config
   */
  static getSpecificCommentVotesList(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCVoteType>> {
    return apiRequest({...config, url: Endpoints.CommentVotesList.url({id}), method: Endpoints.CommentVotesList.method});
  }

  /**
   * This endpoint upvotes a specific comment.
   * @param id
   * @param config
   */
  static upvoteComment(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.CommentVote.url({id}), method: Endpoints.CommentVote.method});
  }

  /**
   * This endpoint retrieves a List of Flags for a Specific Comment.
   * This operation requires moderation role.
   * @param id
   * @param config
   */
  static getSpecificCommentFlags(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest({...config, url: Endpoints.CommentFlagList.url({id}), method: Endpoints.CommentFlagList.method});
  }

  /**
   * This endpoint flags a specific comment.
   * @param id
   * @param flagType
   * @param config
   */
  static flagComment(id: number | string, flagType: SCFlagTypeEnum, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.FlagComment.url({id}), method: Endpoints.FlagComment.method, data: {flagType: flagType}});
  }

  /**
   * This endpoint retrieves, if exists, a flag for this contribute created by the user logged.
   * @param id
   * @param config
   */
  static getSpecificCommentFlagStatus(id: number | string, config?: AxiosRequestConfig): Promise<SCFlagType> {
    return apiRequest({...config, url: Endpoints.CommentFlagStatus.url({id}), method: Endpoints.CommentFlagStatus.method});
  }
}

/**
 *
 :::tip Comment service can be used in the following way:

 ```jsx
 1. Import the service from our library:

 import {CommentService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getAllComments` will return the paginated list of comments.

 async getAllComments() {
        return await CommentService.getAllComments();
      }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async getASpecificComment(commentId) {
        return await CommentService.getASpecificComment(commentId);
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
export default class CommentService {
  static async getAllComments(params: CommentListParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCCommentType>> {
    return CommentApiClient.getAllComments(params, config);
  }
  static async createComment(data: CommentCreateParams, config?: AxiosRequestConfig): Promise<SCCommentType> {
    return CommentApiClient.createComment(data, config);
  }
  static async getASpecificComment(id: number | string, config?: AxiosRequestConfig): Promise<SCCommentType> {
    return CommentApiClient.getASpecificComment(id, config);
  }
  static async updateComment(id: number | string, text: string, config?: AxiosRequestConfig): Promise<SCCommentType> {
    return CommentApiClient.updateComment(id, text, config);
  }
  static async deleteComment(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CommentApiClient.deleteComment(id, config);
  }
  static async restoreComment(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CommentApiClient.restoreComment(id, config);
  }
  static async getSpecificCommentVotesList(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCVoteType>> {
    return CommentApiClient.getSpecificCommentVotesList(id, config);
  }
  static async upvoteComment(id: number | string, config?: AxiosRequestConfig): Promise<any> {
    return CommentApiClient.upvoteComment(id, config);
  }
  static async getSpecificCommentFlags(id: number | string, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlagType>> {
    return CommentApiClient.getSpecificCommentFlags(id, config);
  }
  static async flagComment(id: number | string, flagType: SCFlagTypeEnum, config?: AxiosRequestConfig): Promise<any> {
    return CommentApiClient.flagComment(id, flagType, config);
  }
  static async getSpecificCommentFlagStatus(id: number | string, config?: AxiosRequestConfig): Promise<SCFlagType> {
    return CommentApiClient.getSpecificCommentFlagStatus(id, config);
  }
}
