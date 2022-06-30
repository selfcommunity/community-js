import {InsightService} from '../src/index';

describe('Insight Service Test', () => {
  let contributionId;
  let embed;
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
        embed = data.results[0].embed;
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
    if (embed.id) {
      return InsightService.getEmbedsInsightCounters(embed.embed_type, embed.embed_id).then((data) => {
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
