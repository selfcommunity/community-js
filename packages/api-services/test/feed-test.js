import {generateJWTToken} from '../src/utils/token';
import {FeedService} from '../src/index';

describe('Feed Service Test', () => {
  let token;
  let feedObj;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_ADMIN_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('Get main feed', () => {
    return FeedService.getMainFeed(token).then((data) => {
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
    return FeedService.getMainFeedUnseenCount(token).then((data) => {
      expect(data).toHaveProperty('count_by_category');
    });
  });
  test('Mark specific object read', () => {
    if (feedObj) {
      console.log(feedObj);
      const object = [feedObj[feedObj.type].id];
      return FeedService.markReadASpecificFeedObj(token, object).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Like these feed objs', () => {
    if (feedObj) {
      const object = [feedObj[feedObj.type].id];
      return FeedService.likeFeedObjs(token, object).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    } else {
      test.skip;
    }
  });
});
