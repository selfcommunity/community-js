import client from '../../client';
import Endpoints from '../../constants/Endpoints';

export interface CommentApiClientInterface {
  getAllComments(): Promise<any>;
  createComment(): Promise<any>;
  getASpecificComment(id: number): Promise<any>;
  updateComment(id: number): Promise<any>;
  deleteComment(id: number): Promise<any>;
  restoreComment(id: number): Promise<any>;
  getSpecificCommentVotesList(id: number): Promise<any>;
  upvoteComment(id: number): Promise<any>;
  getSpecificCommentFlags(id: number): Promise<any>;
  flagComment(id: number): Promise<any>;
  getSpecificCommentFlagStatus(id: number): Promise<any>;
}

export class CommentApiClient {
  static getAllComments(): Promise<any> {
    return client
      .request({
        url: Endpoints.Comments.url({}),
        method: Endpoints.Comments.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve comments (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((error) => {
        console.log('Unable to retrieve comments.');
        return Promise.reject(error);
      });
  }

  static createComment(): Promise<any> {
    return client
      .request({
        url: Endpoints.NewComment.url({}),
        method: Endpoints.NewComment.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getASpecificComment(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.Comment.url({id}),
        method: Endpoints.Comment.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static updateComment(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.UpdateComment.url({id}),
        method: Endpoints.UpdateComment.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static deleteComment(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.DeleteComment.url({id}),
        method: Endpoints.DeleteComment.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static restoreComment(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.RestoreComment.url({id}),
        method: Endpoints.RestoreComment.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getSpecificCommentVotesList(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CommentVotesList.url({id}),
        method: Endpoints.CommentVotesList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve votes (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve votes.');
        return Promise.reject(error);
      });
  }

  static upvoteComment(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CommentVote.url({id}),
        method: Endpoints.CommentVote.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getSpecificCommentFlags(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CommentFlagList.url({id}),
        method: Endpoints.CommentFlagList.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve flags list (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve flags list.');
        return Promise.reject(error);
      });
  }

  static flagComment(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.FlagComment.url({id}),
        method: Endpoints.FlagComment.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to perform action (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to perform action.');
        return Promise.reject(error);
      });
  }

  static getSpecificCommentFlagStatus(id: number): Promise<any> {
    return client
      .request({
        url: Endpoints.CommentFlagStatus.url({id}),
        method: Endpoints.CommentFlagStatus.method
      })
      .then((res) => {
        if (res.status >= 300) {
          console.log(`Unable to retrieve flags status (Response code: ${res.status}).`);
          return Promise.reject(res);
        }
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        console.log('Unable to retrieve flags status.');
        return Promise.reject(error);
      });
  }
}

export default class CommentService {
  static async getAllComments(): Promise<any> {
    return CommentApiClient.getAllComments();
  }
  static async createComment(): Promise<any> {
    return CommentApiClient.createComment();
  }
  static async getASpecificComment(id: number): Promise<any> {
    return CommentApiClient.getASpecificComment(id);
  }
  static async updateComment(id: number): Promise<any> {
    return CommentApiClient.updateComment(id);
  }
  static async deleteComment(id: number): Promise<any> {
    return CommentApiClient.deleteComment(id);
  }
  static async restoreComment(id: number): Promise<any> {
    return CommentApiClient.restoreComment(id);
  }
  static async getSpecificCommentVotesList(id: number): Promise<any> {
    return CommentApiClient.getSpecificCommentVotesList(id);
  }
  static async upvoteComment(id: number): Promise<any> {
    return CommentApiClient.upvoteComment(id);
  }
  static async getSpecificCommentFlags(id: number): Promise<any> {
    return CommentApiClient.getSpecificCommentFlags(id);
  }
  static async flagComment(id: number): Promise<any> {
    return CommentApiClient.flagComment(id);
  }
  static async getSpecificCommentFlagStatus(id: number): Promise<any> {
    return CommentApiClient.getSpecificCommentFlagStatus(id);
  }
}
