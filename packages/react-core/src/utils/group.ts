import {SCGroupType, SCUserType} from '@selfcommunity/types';

/**
 * Check if user is an admin of the group
 * @param group
 * @param user
 * @returns boolean
 */
export function isGroupAdmin(group: SCGroupType, user: SCUserType): boolean {
  return Boolean(group && user && group.managed_by?.id === user.id);
}
