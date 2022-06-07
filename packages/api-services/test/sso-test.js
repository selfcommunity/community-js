import {generateJWTToken} from '../src/utils/token';
import {SSOService} from '../src/index';
import {generateString, getRandomInt} from './utils/random';
import client from '../src/client';

describe('SSO Service Test', () => {
  let token;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_ADMIN_USER_ID, process.env.SERVICES_SECRET_KEY);
    client.setBasePortal(process.env.SERVICES_PLATFORM_URL);
    client.setAuthorizeToken(token);
  });
  test('SignUp', () => {
    const data = {username: generateString(), ext_id: getRandomInt()};
    return SSOService.SignUp(data).then((data) => {
      expect(data).toHaveProperty('ext_id');
    });
  });
  test('SignIn', () => {
    return SSOService.SignIn().then((data) => {
      expect(data).toHaveProperty('ext_id');
    });
  });
});
