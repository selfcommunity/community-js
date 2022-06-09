import {PreferenceService} from '../src/index';

describe('Preference Service Test', () => {
  let preference;
  test('Get all dynamic preferences', () => {
    return PreferenceService.getAllPreferences().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Search dynamic preference', () => {
    const name = 'custom_adv_enabled';
    return PreferenceService.searchPreferences(name).then((data) => {
      expect(data.results[0].name).toEqual(name);
      preference = data.results[0];
    });
  });
  test('Get specific dynamic preference', () => {
    return PreferenceService.getSpecificPreference(preference.id).then((data) => {
      expect(data.id).toEqual(preference.id);
    });
  });
});
