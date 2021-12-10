import {SCCommentTypologyType, SCFeedObjectTypologyType} from '@selfcommunity/core';

/**
 * From obj extract type of the contribution
 * @param obj
 */
export function getContributeType(obj) {
  return SCFeedObjectTypologyType.DISCUSSION in obj
    ? SCFeedObjectTypologyType.DISCUSSION
    : SCFeedObjectTypologyType.POST in obj
    ? SCFeedObjectTypologyType.POST
    : SCFeedObjectTypologyType.STATUS in obj
    ? SCFeedObjectTypologyType.STATUS
    : SCCommentTypologyType in obj
    ? SCCommentTypologyType
    : null;
}

/**
 * From obj extract the contribution
 * @param obj
 */
export function getContribute(obj) {
  return SCFeedObjectTypologyType.DISCUSSION in obj
    ? obj[SCFeedObjectTypologyType.DISCUSSION]
    : SCFeedObjectTypologyType.POST in obj
    ? obj[SCFeedObjectTypologyType.POST]
    : SCFeedObjectTypologyType.STATUS in obj
    ? obj[SCFeedObjectTypologyType.STATUS]
    : SCCommentTypologyType in obj
    ? obj[SCCommentTypologyType]
    : null;
}
