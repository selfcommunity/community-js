import {LoyaltyService} from '../src/index';
import {SCPrizeUserStatusType} from '@selfcommunity/types/src/types';

describe('Loyalty Service Test', () => {
  let prize;
  let prizeRequest;
  test('Get all prizes', () => {
    return LoyaltyService.getPrizes().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
      if (data.count !== 0) {
        prize = data.results[0];
      }
    });
  });
  // test('Create a prize', () => {
  //   const body = {title: generateString(), points: getRandomInt(), image: 'sample.jpg'};
  //   return LoyaltyService.createPrize(body).then((data) => {
  //     console.log(data);
  //     expect(data.title).toBe(body.title);
  //     prize = data;
  //   });
  // });
  test('Get a specific prize', () => {
    if (prize) {
      return LoyaltyService.getSpecificPrize(prize.id).then((data) => {
        expect(data).toBeInstanceOf(Object);
      });
    } else {
      test.skip;
    }
  });
  // test('Update a specific prize', () => {
  //   if (prize) {
  //     const body = {title: prize.title, points: prize.points, image: prize.image};
  //     return LoyaltyService.updatePrize(prize.id, body).then((data) => {
  //       expect(data.title).toBe(body.title);
  //     });
  //   } else {
  //     test.skip;
  //   }
  // });
  test('Patch a specific prize', () => {
    if (prize) {
      return LoyaltyService.patchPrize(prize.id).then((data) => {
        expect(data).toBeInstanceOf(Object);
      });
    } else {
      test.skip;
    }
  });
  test('Get all prizes requests', () => {
    return LoyaltyService.getAllPrizeRequests().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Create a prize request', () => {
    return LoyaltyService.createPrizeRequest(prize.id).then((data) => {
      expect(data).toHaveProperty('status_description');
      prizeRequest = data;
    });
  });
  test('Get a specific prize request', () => {
    if (prizeRequest) {
      return LoyaltyService.getSpecificPrizeRequest(prizeRequest.id).then((data) => {
        expect(data.id).toEqual(prizeRequest.id);
      });
    } else {
      test.skip;
    }
  });
  test('Patch a specific prize request', () => {
    if (prizeRequest) {
      const status = SCPrizeUserStatusType.SENT;
      return LoyaltyService.patchPrizeRequest(prizeRequest.id, status).then((data) => {
        expect(data.status).toEqual(status);
      });
    } else {
      test.skip;
    }
  });
});
