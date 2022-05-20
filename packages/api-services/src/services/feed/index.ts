import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface FeedApiClientInterface {
  getMainFeed(): Promise<any>;
  getExploreFeed(): Promise<any>;
  getMainFeedUnseenCount(): Promise<any>;
  markReadASpecificFeedObj(): Promise<any>;
  likeFeedObjs(): Promise<any>;
}

export class FeedApiClient {
  static getMainFeed(): Promise<any> {
    return client
      .request({
        url: Endpoints.MainFeed.url({}),
        method: Endpoints.MainFeed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve main feed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve main feed.');
        return Promise.reject(error);
      });
  }

  static getExploreFeed(): Promise<any> {
    return client
      .request({
        url: Endpoints.ExploreFeed.url({}),
        method: Endpoints.ExploreFeed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve explore feed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve explore feed.');
        return Promise.reject(error);
      });
  }
  static getMainFeedUnseenCount(): Promise<any> {
    return client
      .request({
        url: Endpoints.MainFeedUnseenCount.url({}),
        method: Endpoints.MainFeedUnseenCount.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve result (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve result.');
        return Promise.reject(error);
      });
  }

  static markReadASpecificFeedObj(): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedObjectMarkRead.url({}),
        method: Endpoints.FeedObjectMarkRead.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action(Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static likeFeedObjs(): Promise<any> {
    return client
      .request({
        url: Endpoints.FeedLikeThese.url({}),
        method: Endpoints.FeedLikeThese.method
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
}

export default class FeedService {
  static async getMainFeed(): Promise<any> {
    return FeedApiClient.getMainFeed();
  }
  static async getExploreFeed(): Promise<any> {
    return FeedApiClient.getExploreFeed();
  }

  static async getMainFeedUnseenCount(): Promise<any> {
    return FeedApiClient.getMainFeedUnseenCount();
  }
  static async markReadASpecificFeedObj(): Promise<any> {
    return FeedApiClient.markReadASpecificFeedObj();
  }
  static async likeFeedObjs(): Promise<any> {
    return FeedApiClient.likeFeedObjs();
  }
}
