import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface ModerationApiClientInterface {
  getUsersForModeration(): Promise<any>;
  moderateASpecificUser(id: number): Promise<any>;
  getAllFlaggedContributions(): Promise<any>;
  getSpecificContributionFlag(id: number, contribution_type: string): Promise<any>;
  moderateAContribution(id: number): Promise<any>;
  getContributionModerationStatus(id: number, contribution_type: string): Promise<any>;
}

export class ModerationApiClient {
  static getUsersForModeration(): Promise<any> {
    return client
      .request({
        url: Endpoints.UsersForModeration.url({}),
        method: Endpoints.UsersForModeration.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve users (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve users.');
        return Promise.reject(error);
      });
  }
  static moderateASpecificUser(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.ModerateUser.url({id}),
        method: Endpoints.ModerateUser.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getAllFlaggedContributions(): Promise<any> {
    return client
      .request({
        url: Endpoints.FlaggedContributions.url({}),
        method: Endpoints.FlaggedContributions.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve contributions (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve contributions.');
        return Promise.reject(error);
      });
  }

  static getSpecificContributionFlag(id: number, contribution_type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.FlagsForSpecificContribution.url({id, contribution_type}),
        method: Endpoints.FlagsForSpecificContribution.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static moderateAContribution(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.ModerateContribution.url({id}),
        method: Endpoints.ModerateContribution.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getContributionModerationStatus(id: number, contribution_type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.ModerateContributionStatus.url({id, contribution_type}),
        method: Endpoints.ModerateContributionStatus.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve moderation status for this contribute (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve moderation status for this contribute.');
        return Promise.reject(error);
      });
  }
}

export default class ModerationService {
  static async getUsersForModeration(): Promise<any> {
    return ModerationApiClient.getUsersForModeration();
  }
  static async moderateASpecificUser(id: number): Promise<any> {
    return ModerationApiClient.moderateASpecificUser(id);
  }
  static async getAllFlaggedContributions(): Promise<any> {
    return ModerationApiClient.getAllFlaggedContributions();
  }
  static async getSpecificContributionFlag(id: number, contribution_type: string): Promise<any> {
    return ModerationApiClient.getSpecificContributionFlag(id, contribution_type);
  }
  static async moderateAContribution(id: number): Promise<any> {
    return ModerationApiClient.moderateAContribution(id);
  }
  static async getContributionModerationStatus(id: number, contribution_type: string): Promise<any> {
    return ModerationApiClient.getContributionModerationStatus(id, contribution_type);
  }
}
