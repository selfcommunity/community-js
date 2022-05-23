import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface LegalPageApiClientInterface {
  getLegalPages(): Promise<any>;
  getSpecificLegalPage(id: number): Promise<any>;
  searchLegalPages(): Promise<any>;
  ackLegalPage(id: number): Promise<any>;
  getSpecificUserAck(id: number): Promise<any>;
  userAckList(): Promise<any>;
}

export class LegalPageApiClient {
  static getLegalPages(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetLegalPages.url({}),
        method: Endpoints.GetLegalPages.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve legal pages (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve legal pages.');
        return Promise.reject(error);
      });
  }

  static getSpecificLegalPage(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.LegalPage.url({id}),
        method: Endpoints.LegalPage.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve legal page (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve legal page.');
        return Promise.reject(error);
      });
  }

  static searchLegalPages(): Promise<any> {
    return client
      .request({
        url: Endpoints.SearchLegalPages.url({}),
        method: Endpoints.SearchLegalPages.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve legal pages (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve legal pages.');
        return Promise.reject(error);
      });
  }

  static ackLegalPage(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.AckLegalPage.url({id}),
        method: Endpoints.AckLegalPage.method
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

  static getSpecificUserAck(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.SpecificUserAck.url({id}),
        method: Endpoints.SpecificUserAck.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user ack (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve user ack.');
        return Promise.reject(error);
      });
  }

  static userAckList(): Promise<any> {
    return client
      .request({
        url: Endpoints.UserAckList.url({}),
        method: Endpoints.UserAckList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve user acks (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve user acks.');
        return Promise.reject(error);
      });
  }
}

export default class LegalPageService {
  static async getLegalPages(): Promise<any> {
    return LegalPageApiClient.getLegalPages();
  }

  static async getSpecificLegalPage(id: number): Promise<any> {
    return LegalPageApiClient.getSpecificLegalPage(id);
  }

  static async searchLegalPages(): Promise<any> {
    return LegalPageApiClient.searchLegalPages();
  }

  static async ackLegalPage(id: number): Promise<any> {
    return LegalPageApiClient.ackLegalPage(id);
  }

  static async getSpecificUserAck(id: number): Promise<any> {
    return LegalPageApiClient.getSpecificUserAck(id);
  }

  static async userAckList(): Promise<any> {
    return LegalPageApiClient.userAckList();
  }
}
