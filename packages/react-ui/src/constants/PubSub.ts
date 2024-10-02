import {SCUserType, SCGroupType, SCEventType} from '@selfcommunity/types';

/**
 * Define topics for pubsub
 */
export enum SCTopicType {
  GROUP = 'group',
  EVENT = 'event',
  LAYOUT = 'layout'
}

/**
 * Group/Event event types
 */
export enum SCGroupEventType {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
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

/**
 * Layout event types
 */
export enum SCLayoutEventType {
  DRAWER = 'drawer'
}

/**
 * Layout event types
 */
export interface SCLayoutDrawerType {
  open: boolean;
}
