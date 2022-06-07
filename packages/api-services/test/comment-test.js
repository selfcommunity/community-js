import {generateJWTToken} from '../src/utils/token';
import {CommentService, FeedObjectService} from '../src/index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types/src/types';
import {generateString} from './utils/random';
import {SCFlagTypeEnum} from '../lib/types/src';

describe('Comment Service Test', () => {
  let token;
  let feedObjId;
  let comment;
  const loggedUser = 7;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('Get all discussions', () => {
    return FeedObjectService.getAllFeedObjects(SCFeedObjectTypologyType.DISCUSSION).then((data) => {
      feedObjId = data.results[0].id;
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get all comments', () => {
    return CommentService.getAllComments({discussion: feedObjId}).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Create a comment', () => {
    const body = {discussion: feedObjId, text: generateString()};
    return CommentService.createComment(token, body).then((data) => {
      expect(data.summary).toBe(body.text);
      comment = data;
    });
  });
  test('Get a specific comment', () => {
    return CommentService.getASpecificComment(comment.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Update a comment', () => {
    const text = generateString();
    return CommentService.updateComment(token, comment.id, text).then((data) => {
      expect(data.summary).toBe(text);
    });
  });
  test('Delete a comment', () => {
    return CommentService.deleteComment(token, comment.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Restore a comment', () => {
    return CommentService.restoreComment(token, comment.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get a specific comment votes list', () => {
    return CommentService.getSpecificCommentVotesList(comment.id).then((data) => {
      expect(data).toHaveProperty('count');
    });
  });
  test('Upvote a comment', () => {
    return CommentService.upvoteComment(token, comment.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Flag a comment', () => {
    if (comment.author.id !== loggedUser) {
      return CommentService.flagComment(token, comment.id, SCFlagTypeEnum.SPAM).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific comment flag list', () => {
    return CommentService.getSpecificCommentFlags(token, comment.id).then((data) => {
      expect(data).toHaveProperty('count');
    });
  });
  test('Get a specific comment flag status', () => {
    return CommentService.getSpecificCommentFlagStatus(token, comment.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
});
