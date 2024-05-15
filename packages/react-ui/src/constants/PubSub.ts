import {SCUserType, SCGroupType} from '@selfcommunity/types';

/**
 * Define topics for pubsub
 */
export enum SCTopicType {
  GROUP = 'group'
}

/**
 * Event types
 */
export enum SCEventType {
  CREATE = 'create',
  EDIT = 'edit',
  MEMBERS = 'members',
  ADD_MEMBER = 'members.add_member',
  INVITE_MEMBER = 'members.invite_member',
  REMOVE_MEMBER = 'members.remove_member'
}

/**
 * Event structure
 */
export interface SCGroupChangeEventType {
  group: SCGroupType;
}
export interface SCGroupMembersEventType {
  group: SCGroupType;
  user?: SCUserType;
}
