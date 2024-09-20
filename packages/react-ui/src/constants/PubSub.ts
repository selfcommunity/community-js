import {SCUserType, SCGroupType, SCEventType} from '@selfcommunity/types';

/**
 * Define topics for pubsub
 */
export enum SCTopicType {
  GROUP = 'group',
  EVENT = 'event'
}

/**
 * Group/Event event types
 */
export enum SCGroupEventType {
  CREATE = 'create',
  EDIT = 'edit',
  MEMBERS = 'members',
  ADD_MEMBER = 'members.add_member',
  INVITE_MEMBER = 'members.invite_member',
  REMOVE_MEMBER = 'members.remove_member'
}

export interface SCGroupMembersEventType {
  group: SCGroupType;
  user?: SCUserType;
}

export interface SCEventMembersEventType {
  event: SCEventType;
  user?: SCUserType;
}
