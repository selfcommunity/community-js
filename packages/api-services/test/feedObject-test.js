import {FeedObjectService, PreferenceService} from '../src/index';
import {SCContributionType} from '@selfcommunity/types';
import {generateString} from './utils/random';
import {SCFlagTypeEnum} from '@selfcommunity/types';

describe('Feed Object Service Test', () => {
  const loggedUser = 7;
  let feedObj;
  let type;
  test('Get dynamic preferences', () => {
    return PreferenceService.searchPreferences('discussion_type_enabled').then((data) => {
      if (data.results[0].value) {
        type = SCContributionType.DISCUSSION;
      } else {
        type = SCContributionType.POST;
      }
    });
  });
  test('Get all feedObjs', () => {
    return FeedObjectService.getAllFeedObjects(type).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get all uncommented feedObjs', () => {
    return FeedObjectService.getUncommentedFeedObjects(type).then((data) => {
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
    return FeedObjectService.createFeedObject(type, body).then((data) => {
      expect(data.summary).toBe(body.text);
      feedObj = data;
    });
  });
  test('Search feedObj', () => {
    return FeedObjectService.searchFeedObject(type).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get a specific feedObj', () => {
    return FeedObjectService.getSpecificFeedObject(type, feedObj.id).then((data) => {
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
    return FeedObjectService.updateFeedObject(type, feedObj.id, body).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Delete a feedObj', () => {
    return FeedObjectService.deleteFeedObject(type, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Restore a feedObj', () => {
    return FeedObjectService.restoreFeedObject(type, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get feed obj contributors list', () => {
    return FeedObjectService.feedObjectContributorsList(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get feed obj shares list', () => {
    return FeedObjectService.feedObjectSharesList(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get feed obj user shares list', () => {
    return FeedObjectService.feedObjectSharesList(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get related feedObjs', () => {
    return FeedObjectService.relatedFeedObjects(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Vote a feedObj', () => {
    return FeedObjectService.voteFeedObject(type, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('React to a feedObj', () => {
    return FeedObjectService.voteFeedObject(type, feedObj.id, 3).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get  feedObj votes list', () => {
    return FeedObjectService.feedObjectVotes(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Feed obj poll vote', () => {
    if (feedObj.poll && !feedObj.poll.closed) {
      const choice = feedObj.poll.choices[0];
      return FeedObjectService.feedObjectPollVote(type, feedObj.id, choice.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get  feedObj poll votes list', () => {
    return FeedObjectService.feedObjectPollVotesList(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Follow a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.followFeedObject(type, feedObj.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Check if following feed obj', () => {
    return FeedObjectService.checkIfFollowingFeedObject(type, feedObj.id).then((data) => {
      expect(data).toHaveProperty('following');
    });
  });
  test('FeedObj following list', () => {
    return FeedObjectService.feedObjectFollowingList(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Suspend a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.suspendFeedObject(type, feedObj.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Check if suspended feed obj', () => {
    return FeedObjectService.checkIfSuspendedFeedObject(type, feedObj.id).then((data) => {
      expect(data).toHaveProperty('suspended');
    });
  });
  test('FeedObj suspended list', () => {
    return FeedObjectService.feedObjectSuspendedList(type, feedObj.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Flag a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.flagFeedObject(type, feedObj.id, SCFlagTypeEnum.SPAM).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific feedObj flag list', () => {
    if (loggedUser !== feedObj.author.id) {
      return FeedObjectService.feedObjectFlagList(type, feedObj.id).then((data) => {
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
    return FeedObjectService.feedObjectFlagStatus(type, feedObj.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Hide a feedObj', () => {
    if (feedObj.author.id !== loggedUser) {
      return FeedObjectService.hideFeedObject(type, feedObj.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific feedObj hide status', () => {
    return FeedObjectService.feedObjectHideStatus(type, feedObj.id).then((data) => {
      expect(data).toHaveProperty('hidden');
    });
  });
  test('Delete a feedObj', () => {
    return FeedObjectService.deleteFeedObject(type, feedObj.id).then((data) => {
      expect(data).toBe('');
    });
  });
});
