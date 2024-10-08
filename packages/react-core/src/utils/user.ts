import {SCUserStatus, SCUserType} from '@selfcommunity/types';

/**
 * Staff Roles
 * @type {string}
 */
export const ADMIN_ROLE = 'admin';
export const MODERATOR_ROLE = 'moderator';
export const EDITOR_ROLE = 'editor';
export const COMMUNITY_CREATOR = 1;

/**
 * Get user role from roles(set)
 * @param user
 * @returns role or null
 */
export function getUserRole(user: SCUserType): string | null {
  if (user && user.role) {
    const role = user.role;
    if (role === ADMIN_ROLE) {
      return ADMIN_ROLE;
    } else if (role === MODERATOR_ROLE) {
      return MODERATOR_ROLE;
    } else if (role === EDITOR_ROLE) {
      return EDITOR_ROLE;
    }
  }
  return null;
}

/**
 * Check if user is admin
 * @param user
 * @returns boolean
 */
export function isAdmin(user: SCUserType) {
  return getUserRole(user) === ADMIN_ROLE;
}

/**
 * Check if user is admin
 * @param user
 * @returns boolean
 */
export function isCommunityCreator(user: SCUserType) {
  return user && user.id === COMMUNITY_CREATOR;
}

/**
 * Check if user is moderator
 * @param user
 * @returns boolean
 */
export function isModerator(user: SCUserType) {
  return getUserRole(user) === MODERATOR_ROLE;
}

/**
 * Check if user is editor
 * @param user
 * @returns boolean
 */
export function isEditor(user: SCUserType) {
  return getUserRole(user) === EDITOR_ROLE;
}

/**
 * Check if user is admin or moderator
 * @param user
 * @returns boolean
 */
export function isStaff(user: SCUserType) {
  return isAdmin(user) || isModerator(user) || isEditor(user);
}

/**
 * Check if user is blocked/banned
 * User status values:
 *  a (approved), b (blocked), d (deleted; soft deleted),
 *  u (unregistered; hard deleted). Default: a.
 * @param user
 * @returns {*}
 */
export function isBlocked(user: SCUserType) {
  return user && user.status && user.status === SCUserStatus.BLOCKED;
}
