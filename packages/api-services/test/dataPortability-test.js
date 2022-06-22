import {DataPortabilityService} from '../src/index';

describe('Data Portability Service Test', () => {
  let dataPortability;
  test('Get data portability status', () => {
    return DataPortabilityService.dataPortabilityStatus().then((data) => {
      dataPortability = data;
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Generate data portability', () => {
    if (!dataPortability.requested_at) {
      return DataPortabilityService.generateDataPortability().then((data) => {
        expect(data).toBeInstanceOf(Object);
      });
    } else {
      test.skip;
    }
  });
  test('Download data portability', () => {
    if (!dataPortability.requested_at && !dataPortability.computing) {
      return DataPortabilityService.downloadDataPortability().then((data) => {
        expect(data).toBeInstanceOf(Object);
      });
    }
  });
});
