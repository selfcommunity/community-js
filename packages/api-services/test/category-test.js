import {CategoryService, generateJWTToken} from '../src/index';
import {SCFeedObjectTypologyType} from '@selfcommunity/types/src/types';

describe('Category Service Test', () => {
  let category;
  let token;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('Get all categories', () => {
    return CategoryService.getAllCategories().then((data) => {
      category = data.results[0];
      expect(category).toHaveProperty('name');
    });
  });
  test('Search category', () => {
    return CategoryService.searchCategory({search: category.name}).then((data) => {
      expect(data.results[0].name).toBe(category.name);
    });
  });
  // test('Create a category', () => {
  //   const payload = {name: 'Jest', slug: 'categoria prova jest'};
  //   return CategoryService.createCategory(payload).then((data) => {
  //     category = data;
  //     expect(payload.name).toEqual(data.name);
  //   });
  // });
  test('Get Specific category', () => {
    return CategoryService.getSpecificCategory(category.id).then((data) => {
      expect(data.id).toEqual(category.id);
    });
  });
  // test('Update a  Specific category', () => {
  //   const id = category.id;
  //   const payload = {name: 'Jest update'};
  //   return CategoryService.updateASpecificCategory(id, payload).then((data) => {
  //     expect(payload.name).toEqual(data.name);
  //   });
  // });
  // test('Patch a  Specific category', () => {
  //   const id = category.id;
  //   const payload = {slug: 'Jest patch slug'};
  //   return CategoryService.patchASpecificCategory(id, payload).then((data) => {
  //     expect(payload.slug).toEqual(data.slug);
  //   });
  // });
  // test('Delete a  Specific category', () => {
  //   const id = category.id;
  //   return CategoryService.deleteASpecificCategory(id).then((data) => {
  //     expect(payload.slug).toEqual(data.slug);
  //   });
  // });
  test('Get category audience', () => {
    return CategoryService.getCategoryAudience(category.id).then((data) => {
      expect(data).toHaveProperty('category_audience');
    });
  });
  test('Get category followers', () => {
    return CategoryService.getCategoryFollowers(category.id).then((data) => {
      expect(data.results[0]).toHaveProperty('username');
    });
  });
  test('Get category feed', () => {
    return CategoryService.getCategoryFeed(category.id).then((data) => {
      expect(data.results[0].type).toMatch(SCFeedObjectTypologyType.POST || SCFeedObjectTypologyType.DISCUSSION || SCFeedObjectTypologyType.STATUS);
    });
  });
  test('Get category trending feed', () => {
    return CategoryService.getCategoryTrendingFeed(category.id).then((data) => {
      expect(data.results[0].type).toMatch(SCFeedObjectTypologyType.POST || SCFeedObjectTypologyType.DISCUSSION || SCFeedObjectTypologyType.STATUS);
    });
  });
  test('Follow category', () => {
    return CategoryService.followCategory(category.id, token).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Check if category is followed', () => {
    return CategoryService.checkCategoryIsFollowed(category.id, token).then((data) => {
      expect(data).toHaveProperty('is_followed');
    });
  });
  test('Get followed categories', () => {
    return CategoryService.getFollowedCategories(token, null).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get popular categories', () => {
    return CategoryService.getPopularCategories().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
