import {SCNotificationTypologyType} from '@selfcommunity/core';
import {SCNotificationTopicType} from '../types/notification';

/**
 * List of all possible topics
 */
export const SCNotificationTopics = [SCNotificationTopicType.INTERACTION, SCNotificationTopicType.NEWS];

/**
 * Notification mapping
 */
export const SCNotificationMapping = {
  2: SCNotificationTypologyType.COMMENT,
  4: SCNotificationTypologyType.NESTED_COMMENT,
  55: SCNotificationTypologyType.CONNECTION_REQUEST,
  56: SCNotificationTypologyType.CONNECTION_ACCEPT,
  57: SCNotificationTypologyType.CONNECTION_REJECT,
  58: SCNotificationTypologyType.CONNECTION_CANCEL_REJECT,
  59: SCNotificationTypologyType.CONNECTION_REMOVE,
  60: SCNotificationTypologyType.CONNECTION_CANCEL_REQUEST,
  19: SCNotificationTypologyType.MENTION,
  9: SCNotificationTypologyType.VOTE_UP,
  16: SCNotificationTypologyType.FOLLOW,
  37: SCNotificationTypologyType.PRIVATE_MESSAGE,
  105: SCNotificationTypologyType.DELETE_PRIVATE_MESSAGE,
  50: SCNotificationTypologyType.DELETED_FOR_ADVERTISING,
  51: SCNotificationTypologyType.DELETED_FOR_AGGRESSIVE,
  52: SCNotificationTypologyType.DELETED_FOR_VULGAR,
  65: SCNotificationTypologyType.DELETED_FOR_POOR,
  66: SCNotificationTypologyType.DELETED_FOR_OFFTOPIC,
  54: SCNotificationTypologyType.UNDELETED_FOR,
  75: SCNotificationTypologyType.COLLAPSED_FOR_ADVERTISING,
  76: SCNotificationTypologyType.COLLAPSED_FOR_AGGRESSIVE,
  77: SCNotificationTypologyType.COLLAPSED_FOR_VULGAR,
  78: SCNotificationTypologyType.COLLAPSED_FOR_POOR,
  79: SCNotificationTypologyType.COLLAPSED_FOR_OFFTOPIC,
  97: SCNotificationTypologyType.USER_FOLLOW,
  98: SCNotificationTypologyType.USER_UNFOLLOW,
  67: SCNotificationTypologyType.KINDLY_NOTICE_ADVERTISING,
  68: SCNotificationTypologyType.KINDLY_NOTICE_AGGRESSIVE,
  69: SCNotificationTypologyType.KINDLY_NOTICE_VULGAR,
  70: SCNotificationTypologyType.KINDLY_NOTICE_POOR,
  71: SCNotificationTypologyType.KINDLY_NOTICE_OFFTOPIC,
  73: SCNotificationTypologyType.KINDLY_NOTICE_FLAG,
  74: SCNotificationTypologyType.BLOCKED_USER,
  83: SCNotificationTypologyType.UNBLOCKED_USER,
  96: SCNotificationTypologyType.INCUBATOR_APPROVED,
  99: SCNotificationTypologyType.CUSTOM_NOTIFICATION,
};

/**
 * Silent Notifications
 */
export const SCSilentNotifications: number[] = [57, 58, 59, 60, 98, 99, 105];
