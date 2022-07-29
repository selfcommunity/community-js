import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCUserModerationType, SCUserStatus, SCFlaggedContributionType, SCFlagType, SCFlagTypeEnum, SCContributionType} from '@selfcommunity/types';
import {ModerateContributionParams, SCPaginatedResponse} from '../../types';
import {SCContributionStatus} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';

export interface ModerationApiClientInterface {
  getUsersForModeration(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserModerationType>>;
  moderateASpecificUser(id: number, status: SCUserStatus, config?: AxiosRequestConfig): Promise<any>;
  getAllFlaggedContributions(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlaggedContributionType>>;
  getAllFlagsForSpecificContribution(
    id: number,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>>;
  moderateAContribution(id: number, data: ModerateContributionParams, config?: AxiosRequestConfig): Promise<any>;
  getContributionModerationStatus(id: number, contribution_type: SCContributionType, config?: AxiosRequestConfig): Promise<SCContributionStatus>;
}
/**
 * Contains all the endpoints needed to manage moderation.
 */

export class ModerationApiClient {
  /**
   * This endpoint retrieves all users for moderation purpose.
   */
  static getUsersForModeration(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserModerationType>> {
    return apiRequest({...config, url: Endpoints.UsersForModeration.url({}), method: Endpoints.UsersForModeration.method});
  }

  /**
   * This endpoint performs users moderation.
   * @param id
   * @param status
   * @param config
   */
  static moderateASpecificUser(id: number, status: SCUserStatus, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.ModerateUser.url({id}), method: Endpoints.ModerateUser.method, data: {status: status}});
  }

  /**
   * This endpoint retrieves all flagged contributions.
   */
  static getAllFlaggedContributions(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlaggedContributionType>> {
    return apiRequest({...config, url: Endpoints.FlaggedContributions.url({}), method: Endpoints.FlaggedContributions.method});
  }

  /**
   * This endpoint retrieves all flags for a specific contribution.
   * @param id
   * @param contribution_type
   * @param flag_type
   * @param config
   */
  static getAllFlagsForSpecificContribution(
    id: number,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return apiRequest({
      ...config,
      url: Endpoints.FlagsForSpecificContribution.url({id, contribution_type}),
      method: Endpoints.FlagsForSpecificContribution.method,
      data: {
        flag_type: flag_type ?? null
      }
    });
  }

  /**
   * This endpoint provides actions for flagged contributions moderation.
   * @param id
   * @param data
   * @param config
   */
  static moderateAContribution(id: number, data: ModerateContributionParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.ModerateContribution.url({id}), method: Endpoints.ModerateContribution.method, data: data});
  }

  /**
   * This endpoint retrieves moderation status for a specific contribution.
   * @param id
   * @param contribution_type
   * @param config
   */
  static getContributionModerationStatus(
    id: number,
    contribution_type: SCContributionType,
    config?: AxiosRequestConfig
  ): Promise<SCContributionStatus> {
    return apiRequest({
      ...config,
      url: Endpoints.ModerateContributionStatus.url({id, contribution_type}),
      method: Endpoints.ModerateContributionStatus.method
    });
  }
}

/**
 *
 :::tipModeration service can be used in the following ways:

 ```jsx
 1. Import the service from our library:

 import {ModerationService} from "@selfcommunity/api-services";
 ```
 ```jsx
 2. Create a function and put the service inside it!
 The async function `getUsersForModeration` will return the paginated list of users to moderate.

 async getUsersForModeration() {
        return await ModerationService.getUsersForModeration();
     }
 ```
 ```jsx
 In case of required `params`, just add them inside the brackets.

 async moderateASpecificUser(userId, userStatus) {
       return await ModerationService.moderateASpecificUser(userId, userStatus);
     }
 ```
 :::
 */
export default class ModerationService {
  static async getUsersForModeration(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserModerationType>> {
    return ModerationApiClient.getUsersForModeration(config);
  }
  static async moderateASpecificUser(id: number, status: SCUserStatus, config?: AxiosRequestConfig): Promise<any> {
    return ModerationApiClient.moderateASpecificUser(id, status, config);
  }
  static async getAllFlaggedContributions(config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCFlaggedContributionType>> {
    return ModerationApiClient.getAllFlaggedContributions(config);
  }
  static async getAllFlagsForSpecificContribution(
    id: number,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return ModerationApiClient.getAllFlagsForSpecificContribution(id, contribution_type, flag_type, config);
  }
  static async moderateAContribution(id: number, data: ModerateContributionParams, config?: AxiosRequestConfig): Promise<any> {
    return ModerationApiClient.moderateAContribution(id, data, config);
  }
  static async getContributionModerationStatus(
    id: number,
    contribution_type: SCContributionType,
    config?: AxiosRequestConfig
  ): Promise<SCContributionStatus> {
    return ModerationApiClient.getContributionModerationStatus(id, contribution_type, config);
  }
}
