import {CategoryService} from '../src/index';

describe('Category Service Test', () => {
  let category;
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
      if (data.count !== 0) {
        expect(data.results[0]).toHaveProperty('username');
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Get category feed', () => {
    return CategoryService.getCategoryFeed(category.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get category trending feed', () => {
    return CategoryService.getCategoryTrendingFeed(category.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Follow category', () => {
    return CategoryService.followCategory(category.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Check if category is followed', () => {
    return CategoryService.checkCategoryIsFollowed(category.id).then((data) => {
      expect(data).toHaveProperty('is_followed');
    });
  });
  test('Get followed categories', () => {
    return CategoryService.getFollowedCategories().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get popular categories', () => {
    return CategoryService.getPopularCategories().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
});
