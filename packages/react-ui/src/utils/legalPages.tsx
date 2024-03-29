import {FormattedMessage} from 'react-intl';

/**
 * Return document body
 * @param doc LegalPage document
 * @return string Body document
 */
export const getDocumentBody = (doc) => {
  if (doc.html_body && doc.html_body !== '<p></p>') {
    return doc.html_body;
  }
  return '<p><b><FormattedMessage id="ui.consentSolution.emptyDocument" defaultMessage="ui.consentSolution.emptyDocument" /></b></p>';
};

/**
 * Return true if document body is empty
 * @param doc LegalPage document
 * @return boolean
 */
export const isEmptyDocumentBody = (doc) => {
  return !doc.html_body || (doc.html_body && (doc.html_body === '<p></p>' || doc.html_body === ''));
};

/**
 * Return true if document is acked
 * @param doc LegalPage document
 * @return boolean
 */
export const isDocumentApproved = (doc) => {
  return doc.ack && doc.ack.accepted_at;
};
