import {ReactionService} from '../src/index';

describe('Reaction Service Test', () => {
  let reaction;
  test('Get all reactions', () => {
    return ReactionService.getAllReactions().then((data) => {
      if (data.count !== 0) {
        reaction = data.results[0];
        expect(reaction).toHaveProperty('label');
      }
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get Specific reaction', () => {
    if (reaction) {
      return ReactionService.getSpecificReaction(reaction.id).then((data) => {
        expect(data.id).toEqual(reaction.id);
      });
    } else {
      test.skip;
    }
  });
});
