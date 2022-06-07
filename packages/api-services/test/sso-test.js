import {SSOService} from '../src/index';
import {generateString, getRandomInt} from './utils/random';

describe('SSO Service Test', () => {
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
