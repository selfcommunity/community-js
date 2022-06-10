import {FeedObjectService} from '../src/index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types/src/types';
import {generateString} from './utils/random';
import {SCFlagTypeEnum} from '@selfcommunity/types';

describe('Feed Object Service Test', () => {
  let feedObj;
  const discussion = SCFeedObjectTypologyType.DISCUSSION;
  const loggedUser = 7;
  test('Get all feedObjs', () => {
    return FeedObjectService.getAllFeedObjects(discussion).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get all uncommented feedObjs', () => {
    return FeedObjectService.getUncommentedFeedObjects(discussion).then((data) => {
      if (data.count !== 0) {
        expect(data.results[0].comment_count).toEqual(0);
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Create a feedObj', () => {
    const pollExp = new Date();
    pollExp.setDate(pollExp.getDate() + 20);
    const body = {
      title: generateString(),
      addressing: [],
      text: generateString(),
      medias: [],
      categories: [1],
      location: null,
      poll: {
        title: generateString(),
        multiple_choices: true,
        expiration_at: pollExp.toISOString().split('T')[0],
        choices: [{choice: generateString()}, {choice: generateString()}]
      }
    };
    return FeedObjectService.createFeedObject(discussion, body).then((data) => {
      expect(data.summary).toBe(body.text);
      feedObj = data;
    });
  });
  test('Search feedObj', () => {
    return FeedObjectService.searchFeedObject(discussion).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get a specific feedObj', () => {
    return FeedObjectService.getSpecificFeedObject(discussion, feedObj.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Update a feedObj', () => {
    const newPollExp = new Date();
    newPollExp.setDate(newPollExp.getDate() + 20);
    const body = {
      title: generateString(),
      addressing: [],
      text: generateString(),
      medias: [],
      categories: [1],
      location: null,
      poll: {
        title: generateString(),
        multiple_choices: true,
        expiration_at: newPollExp.toISOString().split('T')[0],
        choices: [{choice: generateString()}, {choice: generateString()}]
      }
    };
    return FeedObjectService.updateFeedObject(discussion, feedObj.id, body).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Delete a feedObj', () => {
    return FeedObjectService.deleteFeedObject(discussion, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Restore a feedObj', () => {
    return FeedObjectService.restoreFeedObject(discussion, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get feed obj contributors list', () => {
    return FeedObjectService.feedObjectContributorsList(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get feed obj shares list', () => {
    return FeedObjectService.feedObjectSharesList(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get feed obj user shares list', () => {
    return FeedObjectService.feedObjectSharesList(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get related feedObjs', () => {
    return FeedObjectService.relatedFeedObjects(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Vote a feedObj', () => {
    return FeedObjectService.voteFeedObject(discussion, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get  feedObj votes list', () => {
    return FeedObjectService.feedObjectVotes(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Feed obj poll vote', () => {
    if (feedObj.poll && !feedObj.poll.closed) {
      const choice = feedObj.poll.choices[0];
      return FeedObjectService.feedObjectPollVote(discussion, feedObj.id, choice.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get  feedObj poll votes list', () => {
    return FeedObjectService.feedObjectPollVotesList(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Follow a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.followFeedObject(discussion, feedObj.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Check if following feed obj', () => {
    return FeedObjectService.checkIfFollowingFeedObject(discussion, feedObj.id).then((data) => {
      expect(data).toHaveProperty('following');
    });
  });
  test('FeedObj following list', () => {
    return FeedObjectService.feedObjectFollowingList(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Suspend a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.suspendFeedObject(discussion, feedObj.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Check if suspended feed obj', () => {
    return FeedObjectService.checkIfSuspendedFeedObject(discussion, feedObj.id).then((data) => {
      expect(data).toHaveProperty('suspended');
    });
  });
  test('FeedObj suspended list', () => {
    return FeedObjectService.feedObjectSuspendedList(discussion, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Flag a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.flagFeedObject(discussion, feedObj.id, SCFlagTypeEnum.SPAM).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific feedObj flag list', () => {
    if (loggedUser !== feedObj.author.id) {
      return FeedObjectService.feedObjectFlagList(discussion, feedObj.id).then((data) => {
        if (data.count !== 0) {
          expect(data.results[0]).toHaveProperty('added_at');
        } else {
          expect(data.results).toBeInstanceOf(Array);
        }
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific feedObj flag status', () => {
    return FeedObjectService.feedObjectFlagStatus(discussion, feedObj.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Hide a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.hideFeedObject(discussion, feedObj.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific feedObj hide status', () => {
    return FeedObjectService.feedObjectHideStatus(discussion, feedObj.id).then((data) => {
      expect(data).toHaveProperty('hidden');
    });
  });
  test('Delete a feedObj', () => {
    return FeedObjectService.deleteFeedObject(discussion, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
});
