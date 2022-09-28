import {LegalPageService} from '../src/index';

describe('Legal Page Service Test', () => {
  let legalPage;
  test('Get all legalPages', () => {
    return LegalPageService.getLegalPages().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
      legalPage = data.results[0];
    });
  });
  test('Get last revision of legal page', () => {
    const policy = 'cookies';
    return LegalPageService.getLastRevisionOfLegalPage(policy).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get all revisions of a legal page', () => {
    const policy = 'cookies';
    return LegalPageService.getAllRevisionsOfLegalPage(policy).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get a specific legalPage', () => {
    return LegalPageService.getSpecificLegalPage(legalPage.id).then((data) => {
      expect(data.id).toEqual(legalPage.id);
    });
  });
  test('Search legalPage', () => {
    const label = legalPage.label;
    return LegalPageService.searchLegalPages({label: label}).then((data) => {
      expect(data.results[0].label).toBe(label);
    });
  });
  test('Ack a legalPage', () => {
    return LegalPageService.ackLegalPage(legalPage.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get legalPage user ack', () => {
    return LegalPageService.getSpecificUserAck(legalPage.id).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get all user acks', () => {
    return LegalPageService.userAckList().then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });
});
