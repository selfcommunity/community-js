import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCUserModerationType, SCUserStatus, SCFlaggedContributionType, SCFlagType, SCFlagTypeEnum, SCContributionType} from '@selfcommunity/types';
import {ModerateContributionParams, SCPaginatedResponse} from '../../types';
import {SCContributionStatus} from '@selfcommunity/types';

export interface ModerationApiClientInterface {
  getUsersForModeration(): Promise<SCPaginatedResponse<SCUserModerationType>>;
  moderateASpecificUser(id: number, status: SCUserStatus): Promise<any>;
  getAllFlaggedContributions(): Promise<SCPaginatedResponse<SCFlaggedContributionType>>;
  getAllFlagsForSpecificContribution(
    id: number,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum
  ): Promise<SCPaginatedResponse<SCFlagType>>;
  moderateAContribution(id: number, data: ModerateContributionParams): Promise<any>;
  getContributionModerationStatus(id: number, contribution_type: SCContributionType): Promise<SCContributionStatus>;
}
/**
 * Contains all the endpoints needed to manage moderation.
 */

export class ModerationApiClient {
  /**
   * This endpoint retrieves all users for moderation purpose.
   */
  static getUsersForModeration(): Promise<SCPaginatedResponse<SCUserModerationType>> {
    return apiRequest(Endpoints.UsersForModeration.url({}), Endpoints.UsersForModeration.method);
  }

  /**
   * This endpoint performs users moderation.
   * @param id
   * @param status
   */
  static moderateASpecificUser(id: number, status: SCUserStatus): Promise<any> {
    return apiRequest(Endpoints.ModerateUser.url({id}), Endpoints.ModerateUser.method, {status: status});
  }

  /**
   * This endpoint retrieves all flagged contributions.
   */
  static getAllFlaggedContributions(): Promise<SCPaginatedResponse<SCFlaggedContributionType>> {
    return apiRequest(Endpoints.FlaggedContributions.url({}), Endpoints.FlaggedContributions.method);
  }

  /**
   * This endpoint retrieves all flags for a specific contribution.
   * @param id
   * @param contribution_type
   * @param flag_type
   */
  static getAllFlagsForSpecificContribution(
    id: number,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest(Endpoints.FlagsForSpecificContribution.url({id, contribution_type}), Endpoints.FlagsForSpecificContribution.method, {
      flag_type: flag_type ?? null
    });
  }

  /**
   * This endpoint provides actions for flagged contributions moderation.
   * @param id
   * @param data
   */
  static moderateAContribution(id: number, data: ModerateContributionParams): Promise<any> {
    return apiRequest(Endpoints.ModerateContribution.url({id}), Endpoints.ModerateContribution.method, data);
  }

  /**
   * This endpoint retrieves moderation status for a specific contribution.
   * @param id
   * @param contribution_type
   */
  static getContributionModerationStatus(id: number, contribution_type: SCContributionType): Promise<SCContributionStatus> {
    return apiRequest(Endpoints.ModerateContributionStatus.url({id, contribution_type}), Endpoints.ModerateContributionStatus.method);
  }
}

export default class ModerationService {
  static async getUsersForModeration(): Promise<SCPaginatedResponse<SCUserModerationType>> {
    return ModerationApiClient.getUsersForModeration();
  }
  static async moderateASpecificUser(id: number, status: SCUserStatus): Promise<any> {
    return ModerationApiClient.moderateASpecificUser(id, status);
  }
  static async getAllFlaggedContributions(): Promise<SCPaginatedResponse<SCFlaggedContributionType>> {
    return ModerationApiClient.getAllFlaggedContributions();
  }
  static async getAllFlagsForSpecificContribution(
    id: number,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return ModerationApiClient.getAllFlagsForSpecificContribution(id, contribution_type, flag_type);
  }
  static async moderateAContribution(id: number, data: ModerateContributionParams): Promise<any> {
    return ModerationApiClient.moderateAContribution(id, data);
  }
  static async getContributionModerationStatus(id: number, contribution_type: SCContributionType): Promise<SCContributionStatus> {
    return ModerationApiClient.getContributionModerationStatus(id, contribution_type);
  }
}
