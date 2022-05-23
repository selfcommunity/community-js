import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface ScoreApiClientInterface {
  getAllScores(): Promise<any>;
  searchScore(): Promise<any>;
  addScore(): Promise<any>;
}

export class ScoreApiClient {
  static getAllScores(): Promise<any> {
    return client
      .request({
        url: Endpoints.ScoresList.url({}),
        method: Endpoints.ScoresList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve scores (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve scores.');
        return Promise.reject(error);
      });
  }
  static searchScore(): Promise<any> {
    return client
      .request({
        url: Endpoints.SearchScore.url({}),
        method: Endpoints.SearchScore.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve score (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve score.');
        return Promise.reject(error);
      });
  }

  static addScore(): Promise<any> {
    return client
      .request({
        url: Endpoints.AddScore.url({}),
        method: Endpoints.AddScore.method
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

export default class ScoreService {
  static async getAllScores(): Promise<any> {
    return ScoreApiClient.getAllScores();
  }
  static async searchScore(): Promise<any> {
    return ScoreApiClient.searchScore();
  }
  static async addScore(): Promise<any> {
    return ScoreApiClient.addScore();
  }
}
