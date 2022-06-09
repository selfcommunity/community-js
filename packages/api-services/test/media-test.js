import {MediaService} from '../src/index';
import {MediaTypes} from '../src/types';

describe('Media Service Test', () => {
  let media;
  test('Create a media', () => {
    const body = {url: 'https://www.google.it/', type: MediaTypes.URL};
    return MediaService.createMedia(body).then((data) => {
      expect(data).toBeInstanceOf(Object);
      media = data;
    });
  });
  test('Click a media', () => {
    return MediaService.clickMedia(media.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get a specific media', () => {
    return MediaService.getSpecificMedia(media.id).then((data) => {
      expect(data.id).toEqual(media.id);
    });
  });
  test('Delete a media', () => {
    return MediaService.deleteMedia(media.id).then((data) => {
      expect(data).toBe('');
    });
  });
});
