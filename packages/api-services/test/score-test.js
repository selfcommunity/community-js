import {ScoreService} from '../src/index';
import {getRandomInt} from './utils/random';

describe('Score Service Test', () => {
  let obj;
  test('Get all scores', () => {
    return ScoreService.getAllScores().then((data) => {
      if (data.count !== 0) {
        obj = data.results[0];
      }
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Search a score', () => {
    const param = {user_id: obj.user.id};
    return ScoreService.searchScore(param).then((data) => {
      expect(data.results[0].user.username).toBe(obj.user.username);
    });
  });
  test('Add/Remove score to a user', () => {
    const body = {user: obj.user.id, score: getRandomInt()};
    return ScoreService.addScore(body).then((data) => {
      expect(data.score).toBe(body.score);
    });
  });
});
