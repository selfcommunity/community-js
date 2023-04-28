import {PrivateMessageService, UserService} from '../src/index';
import {generateString} from './utils/random';

describe('Private Message Service Test', () => {
  const loggedUser = 7;
  let threadId;
  let message;
  let receiverId;
  let receiverUsername;
  test('Get all snippets', () => {
    return PrivateMessageService.getAllSnippets().then((data) => {
      if (data.count !== 0) {
        threadId = data.results[0].id;
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Get a thread', () => {
    if (threadId) {
      return PrivateMessageService.getAThread({thread: threadId}).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
        message = data.results[0];
      });
    } else {
      test.skip;
    }
  });
  test('Get a single message', () => {
    if (message) {
      return PrivateMessageService.getASingleMessage(message.id).then((data) => {
        expect(data).toBeInstanceOf(Object);
      });
    } else {
      test.skip;
    }
  });
  test('Get users followers', () => {
    return UserService.getUserFollowers(loggedUser).then((data) => {
      if (data.count !== 0) {
        receiverId = data.results[0].id;
        receiverUsername = data.results[0].username;
      }
    });
  });
  test('Search User', () => {
    if (receiverUsername) {
      return PrivateMessageService.searchUser(receiverUsername).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
        console.log(data, receiverUsername);
      });
    } else {
      test.skip;
    }
  });
  test('Send a message', () => {
    if (receiverId) {
      const body = {recipients: [receiverId], message: generateString()};
      return PrivateMessageService.sendAMessage(body).then((data) => {
        expect(data).toBeInstanceOf(Object);
        message = data;
      });
    } else {
      test.skip;
    }
  });
  test('Delete a message', () => {
    if (message) {
      return PrivateMessageService.deleteAMessage(message[0].id).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Delete a thread', () => {
    if (threadId) {
      return PrivateMessageService.deleteAThread({thread: threadId}).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
});
