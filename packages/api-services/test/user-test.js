import {PreferenceService, UserService} from '../src/index';
import {generateEmail, generateString} from './utils/random';

describe('User Service Test', () => {
  const loggedUser = 7;
  const admin = 1;
  const password = 'Password!';
  let user;
  let newEmail;
  let avatar;
  let enabled;
  test('Get dynamic preferences', () => {
    return PreferenceService.searchPreferences('follow_enabled').then((data) => {
      enabled = data.results[0].value;
    });
  });
  test('Get Current User', () => {
    return UserService.getCurrentUser().then((data) => {
      user = data;
      expect(user).toHaveProperty('username');
    });
  });
  test('List user connection statuses', () => {
    const users = [user.id];
    return UserService.getUserConnectionStatuses(users).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get users tags to address a contribution', () => {
    return UserService.userTagToAddressContribution().then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });
  test('Update a  Specific user', () => {
    return UserService.userUpdate(user.id, {username: user.username}).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Patch a  Specific user', () => {
    return UserService.userPatch(user.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Change user mail', () => {
    newEmail = generateEmail();
    return UserService.changeUserMail(user.id, newEmail).then((data) => {
      expect(data).toBe('');
    });
  });
  // test('Confirm change user mail', () => {
  //   return UserService.confirmChangeUserMail(user.id, newEmail).then((data) => {
  //     expect(data).toBe('');
  //   });
  // });
  test('Change user password', () => {
    return UserService.changeUserPassword(user.id, password, password).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get user avatars', () => {
    return UserService.getUserAvatars().then((data) => {
      if (data) {
        avatar = data[0].id;
      }
      expect(data).toBeInstanceOf(Array);
    });
  });
  test('Set user primary avatar', () => {
    if (avatar) {
      return UserService.setUserPrimaryAvatar(avatar).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('User settings', () => {
    return UserService.userSettings(user.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Change user settings', () => {
    return UserService.userSettingsPatch(user.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get all users', () => {
    return UserService.getAllUsers().then((data) => {
      user = data[0];
      expect(user).toHaveProperty('username');
    });
  });
  test('Get hidden users', () => {
    return UserService.getHiddenUsers().then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });
  test('User Autocomplete', () => {
    return UserService.userAutocomplete({username: user.username}).then((data) => {
      if (data) {
        expect(data[0].username).toBe(user.username);
      } else {
        expect(data).toBe('');
      }
    });
  });
  test('Search user', () => {
    return UserService.userSearch({username: user.username}).then((data) => {
      if (data.count) {
        expect(data.results[0].username).toBe(user.username);
      }
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get Specific user', () => {
    return UserService.getSpecificUser(user.id).then((data) => {
      expect(data.id).toEqual(user.id);
    });
  });
  test('Get user counters', () => {
    return UserService.getUserCounters(user.id).then((data) => {
      expect(data).toHaveProperty('posts');
    });
  });
  test('Get Current User Avatar', () => {
    return UserService.getCurrentUserAvatar().then((data) => {
      expect(data).toHaveProperty('avatar');
    });
  });
  test('Get current user permission', () => {
    return UserService.getCurrentUserPermission().then((data) => {
      if (data) {
        expect(data).toHaveProperty('create_post');
      } else {
        expect(data).toBe('');
      }
    });
  });
  test('Get user platform', () => {
    return UserService.getCurrentUserPlatform().then((data) => {
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
  if (enabled) {
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
      if (user.id !== loggedUser) {
        return UserService.followUser(user.id).then((data) => {
          expect(data).toBe('');
        });
      } else {
        test.skip;
      }
    });
    test('Check user  followed', () => {
      return UserService.checkUserFollowed(user.id).then((data) => {
        expect(data).toHaveProperty('is_followed');
      });
    });
    test('Check user follower', () => {
      return UserService.checkUserFollower(user.id).then((data) => {
        expect(data).toHaveProperty('is_follower');
      });
    });
  }
  test('Show/Hide User', () => {
    if (user.id !== loggedUser && user.id !== admin) {
      return UserService.showHideUser(user.id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Check user hidden', () => {
    return UserService.checkUserHidden(user.id).then((data) => {
      expect(data).toHaveProperty('is_hidden');
    });
  });
  test('Check user hidden by', () => {
    return UserService.checkUserHiddenBy(user.id).then((data) => {
      expect(data).toHaveProperty('is_hidden_by');
    });
  });
  test('Get user loyalty points', () => {
    return UserService.getUserLoyaltyPoints(user.id).then((data) => {
      expect(data).toHaveProperty('points');
    });
  });
  test('Check email ', () => {
    const e = generateString();
    return UserService.checkUserEmailToken(e).then((data) => {
      expect(data).toHaveProperty('is_valid');
    });
  });
});

describe('User Service Test -connections enabled-', () => {
  const loggedUser = 7;
  let user;
  let enabled;
  test('Get dynamic preferences', () => {
    return PreferenceService.searchPreferences('follow_enabled').then((data) => {
      enabled = !data.results[0].value;
    });
  });
  if (enabled) {
    test('Get all users', () => {
      return UserService.getAllUsers().then((data) => {
        user = data[0];
        expect(user).toHaveProperty('username');
      });
    });
    test('Get user connections', () => {
      return UserService.getUserConnections(user.id).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    });
    test('Check user connection', () => {
      return UserService.checkUserConnections(user.id).then((data) => {
        expect(data).toHaveProperty('is_connection');
      });
    });
    test('Get user connection requests', () => {
      return UserService.getUserConnectionRequests(user.id).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    });
    test('Get user connection requests sent', () => {
      return UserService.getUserRequestConnectionsSent(user.id).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    });
    if (user.id !== loggedUser) {
      test('User accept request connection', () => {
        return UserService.userAcceptRequestConnection(user.id).then((data) => {
          expect(data).toBe('');
        });
      });
      test('User request connection', () => {
        return UserService.userRequestConnection(user.id).then((data) => {
          expect(data).toBe('');
        });
      });
      test('User remove connection', () => {
        return UserService.userRemoveConnection(user.id).then((data) => {
          expect(data).toBe('');
        });
      });
      test('User cancel reject connection request', () => {
        return UserService.userCancelRejectConnectionRequest(user.id).then((data) => {
          expect(data).toBe('');
        });
      });
      test('User cancel request connection', () => {
        return UserService.userCancelRequestConnection(user.id).then((data) => {
          expect(data).toBe('');
        });
      });
      test('User reject connection request', () => {
        return UserService.userRejectConnectionRequest(user.id).then((data) => {
          expect(data).toBe('');
        });
      });
      test('User mark seen connection request', () => {
        return UserService.userMarkSeenConnectionRequest(user.id).then((data) => {
          expect(data).toBe('');
        });
      });
    }
  }
});
