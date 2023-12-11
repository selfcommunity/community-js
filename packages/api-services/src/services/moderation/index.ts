import {apiRequest} from '../../utils/apiRequest';
import Endpoints from '../../constants/Endpoints';
import {SCUserModerationType, SCUserStatus, SCFlaggedContributionType, SCFlagType, SCFlagTypeEnum, SCContributionType} from '@selfcommunity/types';
import {FlaggedContributionParams, ModerateContributionParams, ModerationParams, SCPaginatedResponse} from '../../types';
import {SCContributionStatus} from '@selfcommunity/types';
import {AxiosRequestConfig} from 'axios';
import {urlParams} from '../../utils/url';

export interface ModerationApiClientInterface {
  getUsersForModeration(params?: ModerationParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserModerationType>>;
  moderateASpecificUser(id: number | string, status: SCUserStatus, days_blocked?: string, hard?: number, config?: AxiosRequestConfig): Promise<any>;
  getAllFlaggedContributions(
    params?: FlaggedContributionParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlaggedContributionType>>;
  getAllFlagsForSpecificContribution(
    id: number | string,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>>;
  moderateAContribution(id: number | string, data: ModerateContributionParams, config?: AxiosRequestConfig): Promise<any>;
  getContributionModerationStatus(
    id: number | string,
    contribution_type: SCContributionType,
    config?: AxiosRequestConfig
  ): Promise<SCContributionStatus>;
}
/**
 * Contains all the endpoints needed to manage moderation.
 */

export class ModerationApiClient {
  /**
   * This endpoint retrieves all users for moderation purpose.
   * @param params
   * @param config
   */
  static getUsersForModeration(params?: ModerationParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserModerationType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.UsersForModeration.url({})}?${p.toString()}`, method: Endpoints.UsersForModeration.method});
  }

  /**
   * This endpoint performs users moderation.
   * @param id
   * @param status
   * @param days_blocked
   * @param hard
   * @param config
   */
  static moderateASpecificUser(
    id: number | string,
    status: SCUserStatus,
    days_blocked?: string,
    hard?: number,
    config?: AxiosRequestConfig
  ): Promise<any> {
    const p = urlParams({...(days_blocked && {days_blocked: days_blocked}), ...(hard && {hard: hard})});
    return apiRequest({
      ...config,
      url: `${Endpoints.ModerateUser.url({id})}?${p.toString()}`,
      method: Endpoints.ModerateUser.method,
      data: {status: status}
    });
  }

  /**
   * This endpoint retrieves all flagged contributions.
   * @param params
   * @param config
   */
  static getAllFlaggedContributions(
    params?: FlaggedContributionParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlaggedContributionType>> {
    const p = urlParams(params);
    return apiRequest({...config, url: `${Endpoints.FlaggedContributions.url({})}?${p.toString()}`, method: Endpoints.FlaggedContributions.method});
  }

  /**
   * This endpoint retrieves all flags for a specific contribution.
   * @param id
   * @param contribution_type
   * @param flag_type
   * @param config
   */
  static getAllFlagsForSpecificContribution(
    id: number | string,
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
  static moderateAContribution(id: number | string, data: ModerateContributionParams, config?: AxiosRequestConfig): Promise<any> {
    return apiRequest({...config, url: Endpoints.ModerateContribution.url({id}), method: Endpoints.ModerateContribution.method, data: data});
  }

  /**
   * This endpoint retrieves moderation status for a specific contribution.
   * @param id
   * @param contribution_type
   * @param config
   */
  static getContributionModerationStatus(
    id: number | string,
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
 :::tip Moderation service can be used in the following way:

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
 ```jsx
 If you need to customize the request, you can add optional config params (`AxiosRequestConfig` type).

 1. Declare it(or declare them, it is possible to add multiple params)

 const headers = headers: {Authorization: `Bearer ${yourToken}`}

 2. Add it inside the brackets and pass it to the function, as shown in the previous example!
 ```
 :::
 */
export default class ModerationService {
  static async getUsersForModeration(params?: ModerationParams, config?: AxiosRequestConfig): Promise<SCPaginatedResponse<SCUserModerationType>> {
    return ModerationApiClient.getUsersForModeration(params, config);
  }
  static async moderateASpecificUser(
    id: number | string,
    status: SCUserStatus,
    days_blocked?: string,
    hard?: number,
    config?: AxiosRequestConfig
  ): Promise<any> {
    return ModerationApiClient.moderateASpecificUser(id, status, days_blocked, hard, config);
  }
  static async getAllFlaggedContributions(
    params?: FlaggedContributionParams,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlaggedContributionType>> {
    return ModerationApiClient.getAllFlaggedContributions(params, config);
  }
  static async getAllFlagsForSpecificContribution(
    id: number | string,
    contribution_type: SCContributionType,
    flag_type?: SCFlagTypeEnum,
    config?: AxiosRequestConfig
  ): Promise<SCPaginatedResponse<SCFlagType>> {
    return ModerationApiClient.getAllFlagsForSpecificContribution(id, contribution_type, flag_type, config);
  }
  static async moderateAContribution(id: number | string, data: ModerateContributionParams, config?: AxiosRequestConfig): Promise<any> {
    return ModerationApiClient.moderateAContribution(id, data, config);
  }
  static async getContributionModerationStatus(
    id: number | string,
    contribution_type: SCContributionType,
    config?: AxiosRequestConfig
  ): Promise<SCContributionStatus> {
    return ModerationApiClient.getContributionModerationStatus(id, contribution_type, config);
  }
}
