import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface FeedObjectApiClientInterface {
  getAllFeedObjects(type: string): Promise<any>;
  getUncommentedFeedObjects(type: string): Promise<any>;
  searchFeedObject(type: string): Promise<any>;
  createFeedObject(type: string): Promise<any>;
  getSpecificFeedObject(type: string, id: number): Promise<any>;
  updateFeedObject(type: string, id: number): Promise<any>;
  deleteFeedObject(type: string, id: number): Promise<any>;
  feedObjectContributorsList(id: number, type: string): Promise<any>;
  feedObjectSharesList(type: string, id: number): Promise<any>;
  feedObjectUserSharesList(type: string, id: number): Promise<any>;
  restoreFeedObject(type: string, id: number): Promise<any>;
  relatedFeedObjects(type: string, id: number): Promise<any>;

  voteFeedObject(type: string, id: number): Promise<any>;
  feedObjectVotes(type: string, id: number): Promise<any>;
  feedObjectPollVote(type: string, id: number): Promise<any>;
  feedObjectPollVotesList(type: string, id: number): Promise<any>;
  followFeedObject(type: string, id: number): Promise<any>;
  feedObjectFollowingList(type: string): Promise<any>;
  checkIfFollowingFeedObject(type: string, id: number): Promise<any>;
  suspendFeedObject(type: string, id: number): Promise<any>;
  checkIfSuspendedFeedObject(type: string, id: number): Promise<any>;
  feedObjectSuspendedList(type: string): Promise<any>;
  flagFeedObject(type: string, id: number): Promise<any>;
  feedObjectFlagList(type: string, id: number): Promise<any>;
  feedObjectFlagStatus(type: string, id: number): Promise<any>;
  hideFeedObject(type: string, id: number): Promise<any>;
  feedObjectHideStatus(type: string, id: number): Promise<any>;
}

export class FeedObjectApiClient {
  static getAllFeedObjects(type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectList.url({type}),
        method: Endpoints.FeedObjectList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed objects (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed objects.');
        return Promise.reject(error);
      });
  }

  static getUncommentedFeedObjects(type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectsUncommented.url({type}),
        method: Endpoints.FeedObjectsUncommented.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve uncommented feed object (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve uncommented feed object.');
        return Promise.reject(error);
      });
  }

  static searchFeedObject(type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.SearchFeedObject.url({type}),
        method: Endpoints.SearchFeedObject.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed object (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed object.');
        return Promise.reject(error);
      });
  }

  static createFeedObject(type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.CreateFeedObject.url({type}),
        method: Endpoints.CreateFeedObject.method
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

  static getSpecificFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObject.url({type, id}),
        method: Endpoints.FeedObject.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed object (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed object.');
        return Promise.reject(error);
      });
  }

  static updateFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UpdateFeedObject.url({id, type}),
        method: Endpoints.UpdateFeedObject.method
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

  static deleteFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.DeleteFeedObject.url({type, id}),
        method: Endpoints.DeleteFeedObject.method
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

  static feedObjectContributorsList(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectContributorsList.url({type, id}),
        method: Endpoints.FeedObjectContributorsList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed object contributors (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed object contributors.');
        return Promise.reject(error);
      });
  }

  static feedObjectSharesList(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectSharesList.url({type, id}),
        method: Endpoints.FeedObjectSharesList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed object shares (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed object shares.');
        return Promise.reject(error);
      });
  }

  static feedObjectUserSharesList(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectUserSharesList.url({type, id}),
        method: Endpoints.FeedObjectUserSharesList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed object users shares (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed object users shares.');
        return Promise.reject(error);
      });
  }

  static restoreFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.RestoreFeedObject.url({type, id}),
        method: Endpoints.RestoreFeedObject.method
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

  static relatedFeedObjects(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.RelatedFeedObjects.url({type, id}),
        method: Endpoints.RelatedFeedObjects.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve related feed objects (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve related feed objects.');
        return Promise.reject(error);
      });
  }

  static voteFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Vote.url({type, id}),
        method: Endpoints.Vote.method
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

  static feedObjectVotes(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.VotesList.url({type, id}),
        method: Endpoints.VotesList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed object votes (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed object votes.');
        return Promise.reject(error);
      });
  }

  static feedObjectPollVote(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.PollVote.url({type, id}),
        method: Endpoints.PollVote.method
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

  static feedObjectPollVotesList(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.PollVotesList.url({type, id}),
        method: Endpoints.PollVotesList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve poll votes (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve poll votes.');
        return Promise.reject(error);
      });
  }

  static followFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FollowContribution.url({id}),
        method: Endpoints.FollowContribution.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform follow action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform follow action.');
        return Promise.reject(error);
      });
  }

  static feedObjectFollowingList(type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectFollowingList.url({type}),
        method: Endpoints.FeedObjectFollowingList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve feed object followings (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve feed object followings.');
        return Promise.reject(error);
      });
  }

  static checkIfFollowingFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CheckIfFollowingFeedObject.url({type, id}),
        method: Endpoints.CheckIfFollowingFeedObject.method
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
  static suspendFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserSuspendContributionNotification.url({type, id}),
        method: Endpoints.UserSuspendContributionNotification.method
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

  static checkIfSuspendedFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UserCheckContributionNotificationSuspended.url({type, id}),
        method: Endpoints.UserCheckContributionNotificationSuspended.method
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

  static feedObjectSuspendedList(type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.UserListContributionNotificationSuspended.url({type}),
        method: Endpoints.UserListContributionNotificationSuspended.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve suspended feed objects (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve suspended feed objects.');
        return Promise.reject(error);
      });
  }
  static flagFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Flag.url({type, id}),
        method: Endpoints.Flag.method
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

  static feedObjectFlagStatus(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FlagStatus.url({type, id}),
        method: Endpoints.FlagStatus.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve status (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve status.');
        return Promise.reject(error);
      });
  }

  static feedObjectFlagList(type: string): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectFlagList.url({type}),
        method: Endpoints.FeedObjectFlagList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve flagged feed objects (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve flagged feed objects.');
        return Promise.reject(error);
      });
  }

  static hideFeedObject(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.HideFeedObject.url({type, id}),
        method: Endpoints.HideFeedObject.method
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

  static feedObjectHideStatus(type: string, id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectHideStatus.url({type, id}),
        method: Endpoints.FeedObjectHideStatus.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve status (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve status.');
        return Promise.reject(error);
      });
  }
}

export default class FeedObjectService {
  static async getAllFeedObjects(type: string): Promise<any> {
    return FeedObjectApiClient.getAllFeedObjects(type);
  }

  static async getUncommentedFeedObjects(type: string): Promise<any> {
    return FeedObjectApiClient.getUncommentedFeedObjects(type);
  }

  static async searchFeedObject(type: string): Promise<any> {
    return FeedObjectApiClient.searchFeedObject(type);
  }

  static async createFeedObject(type: string): Promise<any> {
    return FeedObjectApiClient.createFeedObject(type);
  }

  static async getSpecificFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.getSpecificFeedObject(type, id);
  }

  static async updateFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.updateFeedObject(type, id);
  }

  static async deleteFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.deleteFeedObject(type, id);
  }

  static async feedObjectContributorsList(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectContributorsList(type, id);
  }

  static async feedObjectSharesList(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectSharesList(type, id);
  }

  static async feedObjectUserSharesList(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectUserSharesList(type, id);
  }

  static async restoreFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.restoreFeedObject(type, id);
  }

  static async relatedFeedObjects(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.relatedFeedObjects(type, id);
  }

  static async voteFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.voteFeedObject(type, id);
  }
  static async feedObjectVotes(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectVotes(type, id);
  }
  static async feedObjectPollVote(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectPollVote(type, id);
  }

  static async feedObjectPollVotesList(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectPollVotesList(type, id);
  }

  static async followFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.followFeedObject(type, id);
  }

  static async feedObjectFollowingList(type: string): Promise<any> {
    return FeedObjectApiClient.feedObjectFollowingList(type);
  }

  static async checkIfFollowingFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.checkIfFollowingFeedObject(type, id);
  }

  static async suspendFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.suspendFeedObject(type, id);
  }

  static async checkIfSuspendedFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.checkIfSuspendedFeedObject(type, id);
  }
  static async feedObjectSuspendedList(type: string): Promise<any> {
    return FeedObjectApiClient.feedObjectSuspendedList(type);
  }

  static async flagFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.flagFeedObject(type, id);
  }

  static async feedObjectFlagList(type: string): Promise<any> {
    return FeedObjectApiClient.feedObjectFlagList(type);
  }

  static async feedObjectFlagStatus(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectFlagStatus(type, id);
  }
  static async hideFeedObject(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.hideFeedObject(type, id);
  }

  static async feedObjectHideStatus(type: string, id: number): Promise<any> {
    return FeedObjectApiClient.feedObjectHideStatus(type, id);
  }
}
