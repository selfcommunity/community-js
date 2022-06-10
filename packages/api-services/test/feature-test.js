import {FeatureService} from '../src/index';

describe('Feature Service Test', () => {
  test('Get all features', () => {
    return FeatureService.getAllFeatures().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
