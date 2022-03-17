import React from 'react';
import {SCCommentTypologyType, SCFeedObjectTypologyType, SCRoutes} from '@selfcommunity/core';
import {FormattedMessage} from 'react-intl';

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
 * Get the contribution text
 * Hydrate text with mention, etc.
 * @param obj Object of types: Discussion, Post, Status, Comment
 * @param handleUrl Func that handle urls
 */
export function getContributionHtml(obj, handleUrl) {
  return obj.html.replace(/<mention id="([0-9]+)">@([a-z\d_]+)<\/mention>/gi, (match, id, username) => {
    return `<a target='_blank' href='${handleUrl(SCRoutes.USER_PROFILE_ROUTE_NAME, {id, username})}'>@${username}</a>`;
  });
}

/**
 * Get route name for a contribution
 * @param obj
 */
export function getContributionRouteName(obj) {
  if (obj.type) {
    return SCRoutes[`${obj.type.toUpperCase()}_ROUTE_NAME`];
  }
  return obj.type;
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
    const isContributionTypeObj = obj[contribution_type] && typeof obj[contribution_type] === 'object';
    data = {
      ...obj,
      contribution_type,
      contribution_id: isContributionTypeObj ? obj[contribution_type].id : obj[contribution_type],
      contribution_slug: isContributionTypeObj ? obj[contribution_type].slug : contribution_type
    };
  }
  return data;
}
