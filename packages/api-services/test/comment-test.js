import {CommentService, FeedObjectService, PreferenceService} from '../src/index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types/src/types';
import {generateString} from './utils/random';
import {SCFlagTypeEnum} from '@selfcommunity/types';

describe('Comment Service Test', () => {
  const loggedUser = 7;
  let feedObjId;
  let comment;
  let type;
  test('Get dynamic preferences', () => {
    return PreferenceService.searchPreferences('discussion_type_enabled').then((data) => {
      if (data.results[0].value) {
        type = SCFeedObjectTypologyType.DISCUSSION;
      } else {
        type = SCFeedObjectTypologyType.POST;
      }
    });
  });
  test('Get all feed objs', () => {
    return FeedObjectService.getAllFeedObjects(type).then((data) => {
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
    return CommentService.createComment(body).then((data) => {
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
    return CommentService.updateComment(comment.id, text).then((data) => {
      expect(data.summary).toBe(text);
    });
  });
  test('Delete a comment', () => {
    return CommentService.deleteComment(comment.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Restore a comment', () => {
    return CommentService.restoreComment(comment.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get a specific comment votes list', () => {
    return CommentService.getSpecificCommentVotesList(comment.id).then((data) => {
      expect(data).toHaveProperty('count');
    });
  });
  test('Upvote a comment', () => {
    return CommentService.upvoteComment(comment.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Flag a comment', () => {
    if (comment.author.id !== loggedUser) {
      return CommentService.flagComment(comment.id, SCFlagTypeEnum.SPAM).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific comment flag list', () => {
    return CommentService.getSpecificCommentFlags(comment.id).then((data) => {
      expect(data).toHaveProperty('count');
    });
  });
  test('Get a specific comment flag status', () => {
    return CommentService.getSpecificCommentFlagStatus(comment.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
});
