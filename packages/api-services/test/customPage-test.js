import {CustomPageService} from '../src/index';

describe('Custom Page Service Test', () => {
  let pageId;
  test('Get all custom pages', () => {
    return CustomPageService.getAllCustomPages().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
      if (data.count !== 0) {
        pageId = data.results[0].id;
      } else {
        pageId = null;
      }
    });
  });
  test('Get a specific custom page', () => {
    if (pageId) {
      return CustomPageService.getASpecificCustomPage(pageId).then((data) => {
        expect(data.id).toEqual(pageId);
      });
    } else {
      test.skip;
    }
  });
  test('Search custom page', () => {
    return CustomPageService.searchCustomPages().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
