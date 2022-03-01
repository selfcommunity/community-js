import {SCUserType} from '../types/user';

/**
 * Staff Roles
 * @type {string}
 */
export const ADMIN_ROLE = 'admin';
export const MODERATOR_ROLE = 'moderator';

/**
 * Get user role from roles(set)
 * @param roles
 * @returns {*}
 */
export function getUserRole(user: SCUserType): string | null {
  if (user && user.role) {
    const role = user.role;
    if (role === ADMIN_ROLE) {
      return ADMIN_ROLE;
    } else if (role === MODERATOR_ROLE) {
      return MODERATOR_ROLE;
    }
  }
  return null;
}

/**
 * Check if user is admin
 * @param roles
 * @returns {*}
 */
export function isAdmin(user: SCUserType) {
  return getUserRole(user) === ADMIN_ROLE;
}

/**
 * Check if user is moderator
 * @param roles
 * @returns {*}
 */
export function isModerator(user: SCUserType) {
  return getUserRole(user) === MODERATOR_ROLE;
}

/**
 * Check if user is admin or moderato
 * @param roles
 * @returns {*}
 */
export function isStaff(user: SCUserType) {
  return isAdmin(user) || isModerator(user);
}
