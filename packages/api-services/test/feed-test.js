import {FeedService} from '../src/index';

describe('Feed Service Test', () => {
  let feedObj;
  test('Get main feed', () => {
    return FeedService.getMainFeed().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
      if (data.count !== 0) {
        feedObj = data.results[0];
      }
    });
  });
  test('Get explore feed', () => {
    return FeedService.getExploreFeed().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get main feed unseen count', () => {
    return FeedService.getMainFeedUnseenCount().then((data) => {
      expect(data).toHaveProperty('count_by_category');
    });
  });
  test('Mark specific object read', () => {
    if (feedObj) {
      const object = [feedObj[feedObj.type].id];
      return FeedService.markReadASpecificFeedObj(object).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Like these feed objs', () => {
    if (feedObj) {
      const object = [feedObj[feedObj.type].id];
      return FeedService.likeFeedObjs(object).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    } else {
      test.skip;
    }
  });
});
