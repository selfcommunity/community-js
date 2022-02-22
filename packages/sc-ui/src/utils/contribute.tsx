import React from 'react';
import {SCCommentTypologyType, SCFeedObjectTypologyType} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';
import {Typography} from '@mui/material';

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

/**
 * Get a snippet for a contribution
 * @param obj (Discussion, Post, Status, Comment)
 */
export function getContributionSnippet(obj) {
  if (obj.type === SCFeedObjectTypologyType.DISCUSSION) {
    return obj.summary ? <span dangerouslySetInnerHTML={{__html: obj.summary}}></span> : obj.title;
  } else {
    return obj.summary ? (
      <span dangerouslySetInnerHTML={{__html: obj.summary}}></span>
    ) : (
      <FormattedMessage id={`ui.common.${obj.type.toLowerCase()}WithoutText`} defaultMessage={`ui.common.${obj.type.toLowerCase()}WithoutText`} />
    );
  }
}

/**
 * Get data for scRoutingContext.url()
 * @param obj (Discussion, Post, Status, Comment)
 */
export function getRouteData(obj) {
  let data = {};
  if (
    obj.type === SCFeedObjectTypologyType.DISCUSSION ||
    obj.type === SCFeedObjectTypologyType.POST ||
    obj.type === SCFeedObjectTypologyType.STATUS
  ) {
    data = obj;
  } else if (obj.type === SCCommentTypologyType) {
    const contribution_type = getContributeType(obj);
    data = {
      ...obj,
      contribution_type: contribution_type,
      contribution_id: obj[contribution_type]
    };
  }
  return data;
}
