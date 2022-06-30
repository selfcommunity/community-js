import {TagService} from '../src/index';
import {generateString} from './utils/random';

describe('Tag Service Test', () => {
  let tag;
  const loggedUser = 7;
  test('Get all tags', () => {
    return TagService.getAllTags().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Create a tag', () => {
    const body = {name: generateString(), description: generateString()};
    return TagService.createTag(body).then((data) => {
      expect(data.name).toBe(body.name);
      tag = data;
    });
  });
  test('Search a tag', () => {
    return TagService.searchTag().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get a specific tag', () => {
    return TagService.getSpecificTag(tag.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Update a tag', () => {
    return TagService.updateTag(tag.id, {name: tag.name}).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Patch a tag', () => {
    const name = {name: generateString()};
    return TagService.patchTag(tag.id, name).then((data) => {
      expect(data.name).toBe(name.name);
    });
  });

  test('Assign a tag', () => {
    return TagService.assignATag(tag.id, loggedUser).then((data) => {
      expect(data).toBe('');
    });
  });
});
