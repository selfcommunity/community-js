import {CustomMenuService} from '../src/index';

describe('Custom Menu Service Test', () => {
  let menuId;
  test('Get all custom menus', () => {
    return CustomMenuService.getAllCustomMenus().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
      if (data.count !== 0) {
        menuId = data.results[0].id;
      } else {
        menuId = null;
      }
    });
  });
  test('Get a specific custom menu', () => {
    if (menuId) {
      return CustomMenuService.getASpecificCustomMenu(menuId).then((data) => {
        expect(data.id).toEqual(menuId);
      });
    } else {
      test.skip;
    }
  });
  test('Get base custom menu', () => {
    return CustomMenuService.getBaseCustomMenu().then((data) => {
      expect(data.name).toEqual('base');
    });
  });
  test('Search custom menu', () => {
    return CustomMenuService.searchCustomMenus().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
