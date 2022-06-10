import {CustomAdvService, PreferenceService} from '../src/index';

describe('CustomAdv Service Test', () => {
  let enabled;
  let advId;
  test('Get dynamic preferences', () => {
    return PreferenceService.searchPreferences('custom_adv_enabled').then((data) => {
      enabled = data.results[0].value;
    });
  });
  test('Get all custom advs', () => {
    if (enabled) {
      return CustomAdvService.getAllCustomAdv().then((data) => {
        expect(data.results).toBeInstanceOf(Array);
        if (data.count !== 0) {
          advId = data.results[0].id;
        } else {
          advId = null;
        }
      });
    } else {
      test.skip;
    }
  });
  test('Get a specific custom adv', () => {
    if (enabled && advId) {
      return CustomAdvService.getASpecificCustomAdv(advId).then((data) => {
        expect(data.id).toEqual(advId);
      });
    } else {
      test.skip;
    }
  });
  test('Search custom adv', () => {
    if (enabled) {
      return CustomAdvService.searchCustomAdv().then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    } else {
      test.skip;
    }
  });
});
