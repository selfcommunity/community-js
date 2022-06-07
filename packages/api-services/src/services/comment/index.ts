import Endpoints from '../../constants/Endpoints';
import {apiRequest} from '../../utils/apiRequest';
import {SCCommentType, SCFlagType, SCFlagTypeEnum, SCVoteType} from '@selfcommunity/types';
import {CommentCreateParams, CommentListParams, SCPaginatedResponse} from '../../types';

export interface CommentApiClientInterface {
  getAllComments(params: CommentListParams, token?: string): Promise<SCPaginatedResponse<SCCommentType>>;
  createComment(token: string, data: CommentCreateParams): Promise<SCCommentType>;
  getASpecificComment(id: number, token?: string): Promise<SCCommentType>;
  updateComment(token: string, id: number, text: string): Promise<SCCommentType>;
  deleteComment(token: string, id: number): Promise<any>;
  restoreComment(token: string, id: number): Promise<any>;
  getSpecificCommentVotesList(id: number, token?: string): Promise<SCPaginatedResponse<SCVoteType>>;
  upvoteComment(token: string, id: number): Promise<any>;
  getSpecificCommentFlags(token: string, id: number): Promise<SCPaginatedResponse<SCFlagType>>;
  flagComment(token: string, id: number, flagType: SCFlagTypeEnum): Promise<any>;
  getSpecificCommentFlagStatus(token: string, id: number): Promise<SCFlagType>;
}

/**
 * Contains all the endpoints needed to manage comments.
 */

export class CommentApiClient {
  /**
   * This endpoint retrieves all comments.
   * @param params
   * @param token
   */
  static getAllComments(params: CommentListParams, token?: string): Promise<SCPaginatedResponse<SCCommentType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.Comments.url({})}?${p.toString()}`, Endpoints.Comments.method, token);
  }

  /**
   * This endpoint creates a comment.
   * @param token
   * @param data
   */
  static createComment(token: string, data: CommentCreateParams): Promise<SCCommentType> {
    return apiRequest(Endpoints.NewComment.url({}), Endpoints.NewComment.method, token, data);
  }

  /**
   * This endpoint retrieves a specific comment using ID.
   * @param id
   * @param token
   */
  static getASpecificComment(id: number, token?: string): Promise<SCCommentType> {
    return apiRequest(Endpoints.Comment.url({id}), Endpoints.Comment.method, token);
  }

  /**
   * This endpoint updates a specific comment. The logged user must be the comment creator.
   * @param token
   * @param id
   * @param text
   */
  static updateComment(token: string, id: number, text: string): Promise<SCCommentType> {
    return apiRequest(Endpoints.UpdateComment.url({id}), Endpoints.UpdateComment.method, token, {text: text});
  }

  /**
   * This endpoint deletes a specific comment using ID. The logged user must be the comment creator.
   * @param token
   * @param id
   */
  static deleteComment(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.DeleteComment.url({id}), Endpoints.DeleteComment.method, token);
  }

  /**
   * This endpoint restores a specific comment using ID. The logged user must be the comment creator.
   * @param token
   * @param id
   */
  static restoreComment(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.RestoreComment.url({id}), Endpoints.RestoreComment.method, token);
  }

  /**
   * This endpoint retrieves all votes for a specific comment.
   * @param id
   * @param token
   */
  static getSpecificCommentVotesList(id: number, token?: string): Promise<SCPaginatedResponse<SCVoteType>> {
    return apiRequest(Endpoints.CommentVotesList.url({id}), Endpoints.CommentVotesList.method, token);
  }

  /**
   * This endpoint upvotes a specific comment.
   * @param token
   * @param id
   */
  static upvoteComment(token: string, id: number): Promise<any> {
    return apiRequest(Endpoints.CommentVote.url({id}), Endpoints.CommentVote.method, token);
  }

  /**
   * This endpoint retrieves a List of Flags for a Specific Comment.
   * This operation requires moderation role.
   * @param token
   * @param id
   */
  static getSpecificCommentFlags(token: string, id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest(Endpoints.CommentFlagList.url({id}), Endpoints.CommentFlagList.method, token);
  }

  /**
   * This endpoint flags a specific comment.
   * @param token
   * @param id
   * @param flagType
   */
  static flagComment(token: string, id: number, flagType: SCFlagTypeEnum): Promise<any> {
    return apiRequest(Endpoints.FlagComment.url({id}), Endpoints.FlagComment.method, token, {flagType: flagType});
  }

  /**
   * This endpoint retrieves, if exists, a flag for this contribute created by the user logged.
   * @param token
   * @param id
   */
  static getSpecificCommentFlagStatus(token: string, id: number): Promise<SCFlagType> {
    return apiRequest(Endpoints.CommentFlagStatus.url({id}), Endpoints.CommentFlagStatus.method, token);
  }
}

export default class CommentService {
  static async getAllComments(params: CommentListParams, token?: string): Promise<SCPaginatedResponse<SCCommentType>> {
    return CommentApiClient.getAllComments(params, token);
  }
  static async createComment(token: string, data: CommentCreateParams): Promise<SCCommentType> {
    return CommentApiClient.createComment(token, data);
  }
  static async getASpecificComment(id: number, token?: string): Promise<SCCommentType> {
    return CommentApiClient.getASpecificComment(id, token);
  }
  static async updateComment(token: string, id: number, text: string): Promise<SCCommentType> {
    return CommentApiClient.updateComment(token, id, text);
  }
  static async deleteComment(token: string, id: number): Promise<any> {
    return CommentApiClient.deleteComment(token, id);
  }
  static async restoreComment(token: string, id: number): Promise<any> {
    return CommentApiClient.restoreComment(token, id);
  }
  static async getSpecificCommentVotesList(id: number, token?: string): Promise<SCPaginatedResponse<SCVoteType>> {
    return CommentApiClient.getSpecificCommentVotesList(id, token);
  }
  static async upvoteComment(token: string, id: number): Promise<any> {
    return CommentApiClient.upvoteComment(token, id);
  }
  static async getSpecificCommentFlags(token: string, id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return CommentApiClient.getSpecificCommentFlags(token, id);
  }
  static async flagComment(token: string, id: number, flagType: SCFlagTypeEnum): Promise<any> {
    return CommentApiClient.flagComment(token, id, flagType);
  }
  static async getSpecificCommentFlagStatus(token: string, id: number): Promise<SCFlagType> {
    return CommentApiClient.getSpecificCommentFlagStatus(token, id);
  }
}
