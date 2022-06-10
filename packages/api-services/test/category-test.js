import {CategoryService} from '../src/index';
import {generateString} from './utils/random';

describe('Category Service Test', () => {
  let category;
  test('Create a category', () => {
    const body = {name: generateString(), slug: generateString()};
    return CategoryService.createCategory(body).then((data) => {
      category = data;
      expect(body.name).toEqual(data.name);
    });
  });
  test('Get Specific category', () => {
    if (category) {
      return CategoryService.getSpecificCategory(category.id).then((data) => {
        expect(data.id).toEqual(category.id);
      });
    } else {
      test.skip;
    }
  });
  test('Update a  Specific category', () => {
    if (category) {
      const body = {name: category.name, slug: generateString()};
      return CategoryService.updateASpecificCategory(category.id, body).then((data) => {
        expect(body.name).toEqual(data.name);
      });
    } else {
      test.skip;
    }
  });
  test('Patch a  Specific category', () => {
    if (category) {
      const body = {slug: category.slug};
      return CategoryService.patchASpecificCategory(category.id, body).then((data) => {
        expect(body.slug).toEqual(data.slug);
      });
    } else {
      test.skip;
    }
  });
  test('Delete a  Specific category', () => {
    if (category) {
      return CategoryService.deleteASpecificCategory(category.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get all categories', () => {
    return CategoryService.getAllCategories().then((data) => {
      if (data.count !== 0) {
        category = data.results[0];
        expect(category).toHaveProperty('name');
      }
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Search category', () => {
    if (category) {
      return CategoryService.searchCategory({search: category.name}).then((data) => {
        expect(data.results[0].name).toBe(category.name);
      });
    } else {
      test.skip;
    }
  });
  test('Get category audience', () => {
    if (category) {
      return CategoryService.getCategoryAudience(category.id).then((data) => {
        expect(data).toHaveProperty('category_audience');
      });
    } else {
      test.skip;
    }
  });
  test('Get category followers', () => {
    if (category) {
      return CategoryService.getCategoryFollowers(category.id).then((data) => {
        if (data.count !== 0) {
          expect(data.results[0]).toHaveProperty('username');
        } else {
          expect(data.results).toBeInstanceOf(Array);
        }
      });
    } else {
      test.skip;
    }
  });
  test('Get category feed', () => {
    if (category) {
      return CategoryService.getCategoryFeed(category.id).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    } else {
      test.skip;
    }
  });
  test('Get category trending feed', () => {
    if (category) {
      return CategoryService.getCategoryTrendingFeed(category.id).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    } else {
      test.skip;
    }
  });
  test('Follow category', () => {
    if (category) {
      return CategoryService.followCategory(category.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Check if category is followed', () => {
    if (category) {
      return CategoryService.checkCategoryIsFollowed(category.id).then((data) => {
        expect(data).toHaveProperty('is_followed');
      });
    } else {
      test.skip;
    }
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
