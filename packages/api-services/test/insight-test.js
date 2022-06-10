import {InsightService} from '../src/index';

describe('Insight Service Test', () => {
  let contributionId;
  let embedId;
  let userId;
  test('Get best contribution insight', () => {
    return InsightService.getBestContributionInsight().then((data) => {
      const feedObj = data.results[0];
      const type = Object.keys(feedObj)[0];
      if (data.count !== 0) {
        expect(data.results[0]).toHaveProperty('score');
        contributionId = feedObj[type].id;
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Get best embed insight', () => {
    return InsightService.getBestEmbedInsight().then((data) => {
      if (data.count !== 0) {
        expect(data.results[0]).toHaveProperty('embed');
        embedId = data.results[0].embed.id;
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Get best users insight', () => {
    return InsightService.getBestUsersInsight().then((data) => {
      if (data.count !== 0) {
        expect(data.results[0]).toHaveProperty('user');
        userId = data.results[0].user.id;
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Get best contribution insight counters', () => {
    if (contributionId) {
      return InsightService.getContributionsInsightCounters(contributionId).then((data) => {
        expect(data).toHaveProperty('num_views');
      });
    } else {
      test.skip;
    }
  });
  test('Get best embed insight counters', () => {
    if (embedId) {
      return InsightService.getEmbedsInsightCounters(embedId).then((data) => {
        expect(data).toHaveProperty('num_clicks');
      });
    } else {
      test.skip;
    }
  });
  test('Get best users insight counters', () => {
    if (userId) {
      return InsightService.getUsersInsightCounters(userId).then((data) => {
        expect(data).toHaveProperty('num_followers');
      });
    } else {
      test.skip;
    }
  });
});
