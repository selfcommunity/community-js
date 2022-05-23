import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface EmbedApiClientInterface {
  getAllEmbeds(): Promise<any>;
  createEmbed(): Promise<any>;
  searchEmbed(): Promise<any>;
  getSpecificEmbed(id: number): Promise<any>;
  updateASpecificEmbed(id: number): Promise<any>;
  patchASpecificEmbed(id: number): Promise<any>;
  getEmbedFeed(id: number): Promise<any>;
  getSpecificEmbedFeed(id: number): Promise<any>;
}

export class EmbedApiClient {
  static getAllEmbeds(): Promise<any> {
    return client
      .request({
        url: Endpoints.EmbedList.url({}),
        method: Endpoints.EmbedList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve embeds (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve embeds.');
        return Promise.reject(error);
      });
  }

  static createEmbed(): Promise<any> {
    return client
      .request({
        url: Endpoints.EmbedCreate.url({}),
        method: Endpoints.EmbedCreate.method
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

  static searchEmbed(): Promise<any> {
    return client
      .request({
        url: Endpoints.EmbedSearch.url({}),
        method: Endpoints.EmbedSearch.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve embed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve embed.');
        return Promise.reject(error);
      });
  }

  static getSpecificEmbed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Embed.url({id}),
        method: Endpoints.Embed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve embed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve embed.');
        return Promise.reject(error);
      });
  }

  static updateASpecificEmbed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UpdateEmbed.url({id}),
        method: Endpoints.UpdateEmbed.method
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

  static patchASpecificEmbed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.PatchEmbed.url({id}),
        method: Endpoints.PatchEmbed.method
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

  static getEmbedFeed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.EmbedFeed.url({id}),
        method: Endpoints.EmbedFeed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve embeds feed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve embeds feed.');
        return Promise.reject(error);
      });
  }

  static getSpecificEmbedFeed(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.SpecificEmbedFeed.url({id}),
        method: Endpoints.SpecificEmbedFeed.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve embed feed (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve embed feed.');
        return Promise.reject(error);
      });
  }
}

export default class EmbedService {
  static async getAllEmbeds(): Promise<any> {
    return EmbedApiClient.getAllEmbeds();
  }

  static async searchEmbed(): Promise<any> {
    return EmbedApiClient.searchEmbed();
  }

  static async createEmbed(): Promise<any> {
    return EmbedApiClient.createEmbed();
  }

  static async getSpecificEmbed(id: number): Promise<any> {
    return EmbedApiClient.getSpecificEmbed(id);
  }

  static async updateASpecificEmbed(id: number): Promise<any> {
    return EmbedApiClient.updateASpecificEmbed(id);
  }

  static async patchASpecificEmbed(id: number): Promise<any> {
    return EmbedApiClient.patchASpecificEmbed(id);
  }

  static async getEmbedFeed(id: number): Promise<any> {
    return EmbedApiClient.getEmbedFeed(id);
  }

  static async getSpecificEmbedFeed(id: number): Promise<any> {
    return EmbedApiClient.getSpecificEmbedFeed(id);
  }
}
