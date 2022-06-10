import Endpoints from '../../constants/Endpoints';
import {apiRequest} from '../../utils/apiRequest';
import {SCCommentType, SCFlagType, SCFlagTypeEnum, SCVoteType} from '@selfcommunity/types';
import {CommentCreateParams, CommentListParams, SCPaginatedResponse} from '../../types';

export interface CommentApiClientInterface {
  getAllComments(params: CommentListParams): Promise<SCPaginatedResponse<SCCommentType>>;
  createComment(data: CommentCreateParams): Promise<SCCommentType>;
  getASpecificComment(id: number): Promise<SCCommentType>;
  updateComment(id: number, text: string): Promise<SCCommentType>;
  deleteComment(id: number): Promise<any>;
  restoreComment(id: number): Promise<any>;
  getSpecificCommentVotesList(id: number): Promise<SCPaginatedResponse<SCVoteType>>;
  upvoteComment(id: number): Promise<any>;
  getSpecificCommentFlags(id: number): Promise<SCPaginatedResponse<SCFlagType>>;
  flagComment(id: number, flagType: SCFlagTypeEnum): Promise<any>;
  getSpecificCommentFlagStatus(id: number): Promise<SCFlagType>;
}

/**
 * Contains all the endpoints needed to manage comments.
 */

export class CommentApiClient {
  /**
   * This endpoint retrieves all comments.
   * @param params
   */
  static getAllComments(params: CommentListParams): Promise<SCPaginatedResponse<SCCommentType>> {
    const p = new URLSearchParams(params);
    return apiRequest(`${Endpoints.Comments.url({})}?${p.toString()}`, Endpoints.Comments.method);
  }

  /**
   * This endpoint creates a comment.
   * @param data
   */
  static createComment(data: CommentCreateParams): Promise<SCCommentType> {
    return apiRequest(Endpoints.NewComment.url({}), Endpoints.NewComment.method, data);
  }

  /**
   * This endpoint retrieves a specific comment using ID.
   * @param id
   */
  static getASpecificComment(id: number): Promise<SCCommentType> {
    return apiRequest(Endpoints.Comment.url({id}), Endpoints.Comment.method);
  }

  /**
   * This endpoint updates a specific comment. The logged user must be the comment creator.
   * @param id
   * @param text
   */
  static updateComment(id: number, text: string): Promise<SCCommentType> {
    return apiRequest(Endpoints.UpdateComment.url({id}), Endpoints.UpdateComment.method, {text: text});
  }

  /**
   * This endpoint deletes a specific comment using ID. The logged user must be the comment creator.
   * @param id
   */
  static deleteComment(id: number): Promise<any> {
    return apiRequest(Endpoints.DeleteComment.url({id}), Endpoints.DeleteComment.method);
  }

  /**
   * This endpoint restores a specific comment using ID. The logged user must be the comment creator.
   * @param id
   */
  static restoreComment(id: number): Promise<any> {
    return apiRequest(Endpoints.RestoreComment.url({id}), Endpoints.RestoreComment.method);
  }

  /**
   * This endpoint retrieves all votes for a specific comment.
   * @param id
   */
  static getSpecificCommentVotesList(id: number): Promise<SCPaginatedResponse<SCVoteType>> {
    return apiRequest(Endpoints.CommentVotesList.url({id}), Endpoints.CommentVotesList.method);
  }

  /**
   * This endpoint upvotes a specific comment.
   * @param id
   */
  static upvoteComment(id: number): Promise<any> {
    return apiRequest(Endpoints.CommentVote.url({id}), Endpoints.CommentVote.method);
  }

  /**
   * This endpoint retrieves a List of Flags for a Specific Comment.
   * This operation requires moderation role.
   * @param id
   */
  static getSpecificCommentFlags(id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest(Endpoints.CommentFlagList.url({id}), Endpoints.CommentFlagList.method);
  }

  /**
   * This endpoint flags a specific comment.
   * @param id
   * @param flagType
   */
  static flagComment(id: number, flagType: SCFlagTypeEnum): Promise<any> {
    return apiRequest(Endpoints.FlagComment.url({id}), Endpoints.FlagComment.method, {flagType: flagType});
  }

  /**
   * This endpoint retrieves, if exists, a flag for this contribute created by the user logged.
   * @param id
   */
  static getSpecificCommentFlagStatus(id: number): Promise<SCFlagType> {
    return apiRequest(Endpoints.CommentFlagStatus.url({id}), Endpoints.CommentFlagStatus.method);
  }
}

export default class CommentService {
  static async getAllComments(params: CommentListParams): Promise<SCPaginatedResponse<SCCommentType>> {
    return CommentApiClient.getAllComments(params);
  }
  static async createComment(data: CommentCreateParams): Promise<SCCommentType> {
    return CommentApiClient.createComment(data);
  }
  static async getASpecificComment(id: number): Promise<SCCommentType> {
    return CommentApiClient.getASpecificComment(id);
  }
  static async updateComment(id: number, text: string): Promise<SCCommentType> {
    return CommentApiClient.updateComment(id, text);
  }
  static async deleteComment(id: number): Promise<any> {
    return CommentApiClient.deleteComment(id);
  }
  static async restoreComment(id: number): Promise<any> {
    return CommentApiClient.restoreComment(id);
  }
  static async getSpecificCommentVotesList(id: number): Promise<SCPaginatedResponse<SCVoteType>> {
    return CommentApiClient.getSpecificCommentVotesList(id);
  }
  static async upvoteComment(id: number): Promise<any> {
    return CommentApiClient.upvoteComment(id);
  }
  static async getSpecificCommentFlags(id: number): Promise<SCPaginatedResponse<SCFlagType>> {
    return CommentApiClient.getSpecificCommentFlags(id);
  }
  static async flagComment(id: number, flagType: SCFlagTypeEnum): Promise<any> {
    return CommentApiClient.flagComment(id, flagType);
  }
  static async getSpecificCommentFlagStatus(id: number): Promise<SCFlagType> {
    return CommentApiClient.getSpecificCommentFlagStatus(id);
  }
}
