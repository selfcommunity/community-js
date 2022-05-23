import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface InsightApiClientInterface {
  getBestContributionInsight(): Promise<any>;
  getBestEmbedInsight(): Promise<any>;
  getBestUsersInsight(): Promise<any>;
  getContributionsInsightCounters(): Promise<any>;
  getEmbedsInsightCounters(id: number): Promise<any>;
  getUsersInsightCounters(id: number): Promise<any>;
}

export class InsightApiClient {
  static getBestContributionInsight(): Promise<any> {
    return client
      .request({
        url: Endpoints.InsightBestContribution.url({}),
        method: Endpoints.InsightBestContribution.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve contribution insights (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve contribution insights.');
        return Promise.reject(error);
      });
  }
  static getBestEmbedInsight(): Promise<any> {
    return client
      .request({
        url: Endpoints.InsightBestEmbed.url({}),
        method: Endpoints.InsightBestEmbed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve embed insights. (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve embed insights.');
        return Promise.reject(error);
      });
  }
  static getBestUsersInsight(): Promise<any> {
    return client
      .request({
        url: Endpoints.InsightBestUser.url({}),
        method: Endpoints.InsightBestUser.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user insight (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve user insight.');
        return Promise.reject(error);
      });
  }

  static getContributionsInsightCounters(): Promise<any> {
    return client
      .request({
        url: Endpoints.InsightContributionCounter.url({}),
        method: Endpoints.InsightContributionCounter.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve contribution counters (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve contributions counters.');
        return Promise.reject(error);
      });
  }

  static getEmbedsInsightCounters(): Promise<any> {
    return client
      .request({
        url: Endpoints.InsightEmbedCounter.url({}),
        method: Endpoints.InsightEmbedCounter.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve embeds counters (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve embeds counters.');
        return Promise.reject(error);
      });
  }

  static getUsersInsightCounters(): Promise<any> {
    return client
      .request({
        url: Endpoints.InsightUserCounter.url({}),
        method: Endpoints.InsightUserCounter.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve users counters (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve users counters.');
        return Promise.reject(error);
      });
  }
}

export default class InsightService {
  static async getBestContributionInsight(): Promise<any> {
    return InsightApiClient.getBestContributionInsight();
  }

  static async getBestEmbedInsight(): Promise<any> {
    return InsightApiClient.getBestEmbedInsight();
  }

  static async getBestUsersInsight(): Promise<any> {
    return InsightApiClient.getBestUsersInsight();
  }

  static async getContributionsInsightCounters(): Promise<any> {
    return InsightApiClient.getContributionsInsightCounters();
  }

  static async getEmbedsInsightCounters(): Promise<any> {
    return InsightApiClient.getEmbedsInsightCounters();
  }

  static async getUsersInsightCounters(): Promise<any> {
    return InsightApiClient.getUsersInsightCounters();
  }
}
