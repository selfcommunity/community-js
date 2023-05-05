import {SuggestionService} from '../src/index';

describe('Suggestion Service Test', () => {
  test('Get Category Suggestion', () => {
    return SuggestionService.getCategorySuggestion().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get Incubator Suggestion', () => {
    return SuggestionService.getIncubatorSuggestion().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get Poll Suggestion', () => {
    return SuggestionService.getPollSuggestion().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get User Suggestion', () => {
    return SuggestionService.getUserSuggestion().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get Search Suggestion', () => {
    return SuggestionService.getSearchSuggestion('ni').then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
