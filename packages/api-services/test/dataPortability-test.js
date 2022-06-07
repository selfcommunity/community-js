import {generateJWTToken} from '../src/utils/token';
import {DataPortabilityService} from '../src/index';

describe('Data Portability Service Test', () => {
  let token;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_ADMIN_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('Generate data portability', () => {
    return DataPortabilityService.generateDataPortability(token).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Download data portability', () => {
    return DataPortabilityService.downloadDataPortability(token).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get data portability status', () => {
    return DataPortabilityService.dataPortabilityStatus(token).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
});
