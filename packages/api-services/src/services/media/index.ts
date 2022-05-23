import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface MediaApiClientInterface {
  chunkUploadMedia(): Promise<any>;
  chunkUploadMediaComplete(): Promise<any>;
  createMedia(): Promise<any>;
  clickMedia(id: number): Promise<any>;
  getSpecificMedia(id: number): Promise<any>;
  updateMedia(id: number): Promise<any>;
  deleteMedia(id: number): Promise<any>;
}

export class MediaApiClient {
  static chunkUploadMedia(): Promise<any> {
    return client
      .request({
        url: Endpoints.ComposerChunkUploadMedia.url({}),
        method: Endpoints.ComposerChunkUploadMedia.method
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

  static chunkUploadMediaComplete(): Promise<any> {
    return client
      .request({
        url: Endpoints.ComposerChunkUploadMediaComplete.url({}),
        method: Endpoints.ComposerChunkUploadMediaComplete.method
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

  static createMedia(): Promise<any> {
    return client
      .request({
        url: Endpoints.ComposerMediaCreate.url({}),
        method: Endpoints.ComposerMediaCreate.method
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

  static clickMedia(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.MediaClickTracker.url({id}),
        method: Endpoints.MediaClickTracker.method
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

  static getSpecificMedia(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.GetMedia.url({id}),
        method: Endpoints.GetMedia.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve media (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve media.');
        return Promise.reject(error);
      });
  }

  static updateMedia(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UpdateMedia.url({id}),
        method: Endpoints.UpdateMedia.method
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

  static deleteMedia(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.DeleteMedia.url({id}),
        method: Endpoints.DeleteMedia.method
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
}

export default class MediaService {
  static async chunkUploadMedia(): Promise<any> {
    return MediaApiClient.chunkUploadMedia();
  }

  static async chunkUploadMediaComplete(): Promise<any> {
    return MediaApiClient.chunkUploadMediaComplete();
  }

  static async createMedia(): Promise<any> {
    return MediaApiClient.createMedia();
  }

  static async clickMedia(id: number): Promise<any> {
    return MediaApiClient.clickMedia(id);
  }

  static async getSpecificMedia(id: number): Promise<any> {
    return MediaApiClient.getSpecificMedia(id);
  }

  static async updateMedia(id: number): Promise<any> {
    return MediaApiClient.updateMedia(id);
  }

  static async deleteMedia(id: number): Promise<any> {
    return MediaApiClient.deleteMedia(id);
  }
}
