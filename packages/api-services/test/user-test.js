import {generateJWTToken, UserService} from '../src/index';
import {generateEmail} from './utils/random';

describe('User Service Test', () => {
  let user;
  let token;
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('Get all users', () => {
    return UserService.getAllUsers(token).then((data) => {
      user = data.results[0];
      expect(user).toHaveProperty('username');
    });
  });
  test('Get hidden users', () => {
    return UserService.getHiddenUsers(token).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('User Autocomplete', () => {
    return UserService.userAutocomplete(token, {username: user.username}).then((data) => {
      expect(data.results[0].username).toBe(user.username);
    });
  });
  test('Search user', () => {
    return UserService.userSearch(token, {username: user.username}).then((data) => {
      expect(data.results[0].username).toBe(user.username);
    });
  });
  test('Get Specific user', () => {
    return UserService.getSpecificUser(token, user.id).then((data) => {
      expect(data.id).toEqual(user.id);
    });
  });
  test('Get user counters', () => {
    return UserService.getUserCounters(user.id).then((data) => {
      expect(data).toHaveProperty('polls');
    });
  });
  test('Get Current User Avatar', () => {
    return UserService.getCurrentUserAvatar(token).then((data) => {
      expect(data).toHaveProperty('avatar');
    });
  });
  test('Get current user permission', () => {
    return UserService.getCurrentUserPermission(token).then((data) => {
      expect(data).toHaveProperty('create_post');
    });
  });
  test('Get user platform', () => {
    return UserService.getCurrentUserPlatform(token).then((data) => {
      expect(data).toHaveProperty('platform_url');
    });
  });
  test('Get user followed categories', () => {
    return UserService.getUserFollowedCategories(user.id).then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });
  test('Get user feed', () => {
    return UserService.getUserFeed(user.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get users followers', () => {
    return UserService.getUserFollowers(user.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get users followed', () => {
    return UserService.getUserFollowed(user.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Follow user', () => {
    return UserService.followUser(user.id, token).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Check user  followed', () => {
    return UserService.checkUserFollowed(token, user.id).then((data) => {
      expect(data).toHaveProperty('is_followed');
    });
  });
  test('Check user follower', () => {
    return UserService.checkUserFollower(token, user.id).then((data) => {
      console.log(data);
    });
  });
  test('Show/Hide User', () => {
    return UserService.showHideUser(token, user.id).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Check user hidden', () => {
    return UserService.checkUserHidden(token, user.id).then((data) => {
      expect(data).toHaveProperty('is_hidden');
    });
  });
  test('Check user hidden by', () => {
    return UserService.checkUserHiddenBy(token, user.id).then((data) => {
      expect(data).toHaveProperty('is_hidden_by');
    });
  });
  test('Get user loyalty points', () => {
    return UserService.getUserLoyaltyPoints(token, user.id).then((data) => {
      expect(data).toHaveProperty('points');
    });
  });
  test('Check email token', () => {
    const etoken = '6c1bffa79d63816b55d8861d5a43d16f';
    return UserService.checkUserEmailToken(token, etoken).then((data) => {
      expect(data).toHaveProperty('is_valid');
    });
  });
});

describe('User Service Test -Logged user operations-', () => {
  let user;
  let token;
  let avatar;
  let newEmail;
  const password = 'Password!';
  beforeAll(async () => {
    token = await generateJWTToken(process.env.SERVICES_USER_ID, process.env.SERVICES_SECRET_KEY);
  });
  test('Get Current User', () => {
    return UserService.getCurrentUser(token).then((data) => {
      user = data;
      console.log(user);
      expect(user).toHaveProperty('username');
    });
  });
  test('List user connection statuses', () => {
    const users = [user.id];
    return UserService.getUserConnectionStatuses(token, users).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get users tags to address a contribution', () => {
    return UserService.userTagToAddressContribution(token).then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });
  test('Update a  Specific user', () => {
    return UserService.userUpdate(token, user.id, {username: user.username}).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Patch a  Specific user', () => {
    return UserService.userPatch(token, user.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  // test('Delete a  Specific user', () => {
  //   return UserService.userDelete(user.id).then((data) => {
  //     expect(data).toBe('');
  //   });
  // });
  test('Change user mail', () => {
    const mail = generateEmail();
    newEmail = mail;
    return UserService.changeUserMail(token, user.id, newEmail).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Confirm change user mail', () => {
    return UserService.confirmChangeUserMail(token, user.id, newEmail).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Change user password', () => {
    return UserService.changeUserPassword(token, user.id, password, password).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get user avatars', () => {
    return UserService.getUserAvatars(token).then((data) => {
      avatar = data.results[0].id;
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Set user primary avatar', () => {
    return UserService.setUserPrimaryAvatar(token, avatar).then((data) => {
      expect(data).toBe('');
    });
  });
  test('User settings', () => {
    return UserService.userSettings(token, user.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Change user settings', () => {
    return UserService.userSettingsPatch(token, user.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
});
