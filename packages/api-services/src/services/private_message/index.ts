import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface PrivateMessageApiClientInterface {
  getAllSnippets(): Promise<any>;
  getAThread(): Promise<any>;
  getASingleMessage(id: number): Promise<any>;
  sendAMessage(): Promise<any>;
  deleteAMessage(id: number): Promise<any>;
  deleteAThread(id: number): Promise<any>;
  uploadMedia(): Promise<any>;
  uploadThumbnail(): Promise<any>;
  uploadMediaInChunks(): Promise<any>;
  chunkUploadDone(): Promise<any>;
}

export class PrivateMessageApiClient {
  static getAllSnippets(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetSnippets.url({}),
        method: Endpoints.GetSnippets.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve results (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve results.');
        return Promise.reject(error);
      });
  }
  static getAThread(): Promise<any> {
    return client
      .request({
        url: Endpoints.GetAThread.url({}),
        method: Endpoints.GetAThread.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve thread (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve thread.');
        return Promise.reject(error);
      });
  }

  static getASingleMessage(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetASingleMessage.url({id}),
        method: Endpoints.GetASingleMessage.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve message (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve message.');
        return Promise.reject(error);
      });
  }

  static sendAMessage(): Promise<any> {
    return client
      .request({
        url: Endpoints.SendMessage.url({}),
        method: Endpoints.SendMessage.method
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

  static deleteAMessage(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.DeleteASingleMessage.url({id}),
        method: Endpoints.DeleteASingleMessage.method
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

  static deleteAThread(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.DeleteAThread.url({id}),
        method: Endpoints.DeleteAThread.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable perform action.');
        return Promise.reject(error);
      });
  }

  static uploadMedia(): Promise<any> {
    return client
      .request({
        url: Endpoints.PrivateMessageUploadMedia.url({}),
        method: Endpoints.PrivateMessageUploadMedia.method
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
  static uploadThumbnail(): Promise<any> {
    return client
      .request({
        url: Endpoints.PrivateMessageUploadThumbnail.url({}),
        method: Endpoints.PrivateMessageUploadThumbnail.method
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
  static uploadMediaInChunks(): Promise<any> {
    return client
      .request({
        url: Endpoints.PrivateMessageUploadMediaInChunks.url({}),
        method: Endpoints.PrivateMessageUploadMediaInChunks.method
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

  static chunkUploadDone(): Promise<any> {
    return client
      .request({
        url: Endpoints.PrivateMessageChunkUploadDone.url({}),
        method: Endpoints.PrivateMessageChunkUploadDone.method
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

export default class PrivateMessageService {
  static async getAllSnippets(): Promise<any> {
    return PrivateMessageApiClient.getAllSnippets();
  }
  static async getAThread(): Promise<any> {
    return PrivateMessageApiClient.getAThread();
  }
  static async getASingleMessage(id: number): Promise<any> {
    return PrivateMessageApiClient.getASingleMessage(id);
  }
  static async sendAMessage(): Promise<any> {
    return PrivateMessageApiClient.sendAMessage();
  }
  static async deleteAMessage(id: number): Promise<any> {
    return PrivateMessageApiClient.deleteAMessage(id);
  }
  static async deleteAThread(id: number): Promise<any> {
    return PrivateMessageApiClient.deleteAThread(id);
  }
  static async uploadMedia(): Promise<any> {
    return PrivateMessageApiClient.uploadMedia();
  }
  static async uploadThumbnail(): Promise<any> {
    return PrivateMessageApiClient.uploadThumbnail();
  }
  static async uploadMediaInChunks(): Promise<any> {
    return PrivateMessageApiClient.uploadMediaInChunks();
  }
  static async chunkUploadDone(): Promise<any> {
    return PrivateMessageApiClient.chunkUploadDone();
  }
}
