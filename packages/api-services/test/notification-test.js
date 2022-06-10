import {NotificationService} from '../src/index';
import {generateString} from './utils/random';

describe('Notification Service Test', () => {
  const loggedUser = 7;
  let banner;
  test('List user notifications', () => {
    return NotificationService.listUserNotification().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Mark read notifications', () => {
    const sids = ['16031913361500000000007190'];
    return NotificationService.markReadNotification(sids).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Get unseen notifications', () => {
    return NotificationService.getUnseenNotification().then((data) => {
      expect(data).toHaveProperty('count');
    });
  });
  test('Create custom notification', () => {
    const body = {type: generateString(), title: generateString(), description: generateString(), user: loggedUser};
    return NotificationService.createCustomNotification(body).then((data) => {
      expect(data).toBe('');
    });
  });
  test('List broadcast messages', () => {
    return NotificationService.listBroadcastMessages().then((data) => {
      if (data.count !== 0) {
        banner = data.results[0];
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Broadcast messages unseen count', () => {
    return NotificationService.listBroadcastMessagesUnseenCount().then((data) => {
      expect(data).toHaveProperty('count');
    });
  });
  test('Broadcast messages undisposed count', () => {
    return NotificationService.listBroadcastMessagesUndisposedCount().then((data) => {
      expect(data).toHaveProperty('count');
    });
  });
  test('Mark read broadcast messages', () => {
    if (banner && banner.viewed_at === null) {
      const banner_ids = [banner.id];
      return NotificationService.markReadBroadcastMessages(banner_ids).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Dispose broadcast messages', () => {
    if (banner && banner.disposed_at === null) {
      const banner_ids = [banner.id];
      return NotificationService.disposeBroadcastMessages(banner_ids).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
});
