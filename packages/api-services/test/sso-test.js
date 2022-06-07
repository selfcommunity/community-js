import {generateJWTToken} from '../src/utils/token';
import {SSOService} from '../src/index';
import {generateString, getRandomInt} from './utils/random';

describe('SSO Service Test', () => {
  let token;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_ADMIN_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('SignUp', () => {
    const data = {username: generateString(), ext_id: getRandomInt()};
    return SSOService.SignUp(token, data).then((data) => {
      expect(data).toHaveProperty('ext_id');
    });
  });
  test('SignIn', () => {
    return SSOService.SignIn(token).then((data) => {
      expect(data).toHaveProperty('ext_id');
    });
  });
});
