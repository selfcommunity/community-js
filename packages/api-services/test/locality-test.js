import {LocalityService} from '../src/index';

describe('Locality Service Test', () => {
  test('Get localities', () => {
    return LocalityService.getLocalities().then((data) => {
      if (data.count !== 0) {
        expect(data.results[0]).toHaveProperty('country');
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Search localities', () => {
    return LocalityService.searchLocalities().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
