import {SCGroupType, SCUserType} from '@selfcommunity/types';

/**
 * Check if the current user is an admin of the group (creator, manager or elected admin).
 * Relies on the `can_manage` flag computed by the backend for the requesting user.
 * @param group
 * @param user the current user
 * @returns boolean
 */
export function isGroupAdmin(group: SCGroupType, user: SCUserType): boolean {
  return Boolean(group && user && group.can_manage);
}

/**
 * Check if user is the creator of the group
 * @param group
 * @param user
 * @returns boolean
 */
export function isGroupCreator(group: SCGroupType, user: SCUserType): boolean {
  return Boolean(group && user && group.created_by?.id === user.id);
}
