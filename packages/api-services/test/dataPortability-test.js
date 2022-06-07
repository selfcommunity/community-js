import {DataPortabilityService} from '../src/index';

describe('Data Portability Service Test', () => {
  test('Generate data portability', () => {
    return DataPortabilityService.generateDataPortability().then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Download data portability', () => {
    return DataPortabilityService.downloadDataPortability().then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get data portability status', () => {
    return DataPortabilityService.dataPortabilityStatus().then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
});
