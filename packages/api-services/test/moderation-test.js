import {ModerationService} from '../src/index';
import {SCFlagTypeEnum, SCUserStatus} from '@selfcommunity/types';

describe('Moderation Service Test', () => {
  let user;
  let contribution;
  test('Get users for moderation', () => {
    return ModerationService.getUsersForModeration().then((data) => {
      if (data.count !== 0) {
        user = data.results[0];
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Moderate a specific user', () => {
    if (user) {
      const status = SCUserStatus.APPROVED;
      return ModerationService.moderateASpecificUser(user.id, status).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get all flagged contributions', () => {
    return ModerationService.getAllFlaggedContributions().then((data) => {
      if (data.count !== 0) {
        contribution = data.results[0];
      } else {
        expect(data.results).toBeInstanceOf(Array);
      }
    });
  });
  test('Get all flags for a specific contributions', () => {
    if (contribution) {
      return ModerationService.getAllFlagsForSpecificContribution(contribution.contribution.id, contribution.contribution_type).then((data) => {
        expect(data.results).toBeInstanceOf(Array);
      });
    } else {
      test.skip;
    }
  });
  test('Moderate a specific contribution', () => {
    if (contribution && user) {
      const body = {contribution_type: contribution.contribution_type, action: 'ignore', moderation_type: SCFlagTypeEnum.POOR};
      return ModerationService.moderateAContribution(contribution.contribution.id, body).then((data) => {
        expect(data).toBe('');
      });
    } else {
      test.skip;
    }
  });
  test('Get moderation status for a specific contribution', () => {
    if (contribution) {
      return ModerationService.getContributionModerationStatus(contribution.contribution.id, contribution.contribution_type).then((data) => {
        expect(data).toHaveProperty('flag_type');
      });
    } else {
      test.skip;
    }
  });
});
