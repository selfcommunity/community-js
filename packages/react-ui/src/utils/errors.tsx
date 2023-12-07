import React from 'react';
import {FormattedMessage} from 'react-intl';

/**
 * Catch and display errors when an action is performed and
 * one user is blocked by the other
 * @param e (error)
 * @return boolean (true if catch errors 403)
 */
export function catchUnauthorizedActionByBlockedUser(e, isBlockedByMe, enqueueSnackbar) {
  let _cathedErrors = false;
  if (e && e.response && e.response && e.response.status && e.response.status === 403) {
    if (isBlockedByMe) {
      enqueueSnackbar(<FormattedMessage id="ui.common.actionToUserBlockedByMe" defaultMessage="ui.common.actionToUserBlockedByMe" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    } else {
      enqueueSnackbar(<FormattedMessage id="ui.common.actionToUserHasBlockedMe" defaultMessage="ui.common.actionToUserHasBlockedMe" />, {
        variant: 'warning',
        autoHideDuration: 3000
      });
    }
    _cathedErrors = true;
  }
  return _cathedErrors;
}
