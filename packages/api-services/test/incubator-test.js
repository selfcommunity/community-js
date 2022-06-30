import {IncubatorService} from '../src/index';
import {generateString} from './utils/random';

describe('Incubator Service Test', () => {
  let incubator;
  const loggedUser = 7;
  test('Get all incubators', () => {
    return IncubatorService.getAllIncubators().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Create a incubator', () => {
    const body = {name: generateString()};
    return IncubatorService.createIncubator(body).then((data) => {
      expect(data.name).toBe(body.name);
      incubator = data;
    });
  });
  test('Get a specific incubator', () => {
    return IncubatorService.getSpecificIncubator(incubator.id).then((data) => {
      expect(data.id).toEqual(incubator.id);
    });
  });
  test('Search incubator', () => {
    const name = incubator.name;
    return IncubatorService.searchIncubators({name: name}).then((data) => {
      expect(data.results[0].name).toBe(name);
    });
  });
  test('Subscribe to an incubator', () => {
    if (incubator.user.id !== loggedUser) {
      return IncubatorService.subscribeToIncubator(incubator.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get incubator subscribers', () => {
    return IncubatorService.getIncubatorSubscribers(incubator.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Check incubator subscription', () => {
    return IncubatorService.checkIncubatorSubscription(incubator.id).then((data) => {
      expect(data).toHaveProperty('subscribed');
    });
  });
});
