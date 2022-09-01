import {AccountService} from '../src/index';
import {generateEmail, generateString} from './utils/random';

describe('Account Service Test', () => {
  const password = 'Password!0';
  let email;
  test('Create', () => {
    const data = {username: generateString(), email: generateEmail(), password: password};
    return AccountService.create(data).then((res) => {
      email = res.email;
      expect(data.username).toEqual(res.username);
    });
  });
  test('Recover', () => {
    return AccountService.recover({email}).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Search', () => {
    return AccountService.search({email}).then((data) => {
      expect(data.email).toEqual(email);
    });
  });
});
