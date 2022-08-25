/**
 * SSOSigninType interface
 */

export interface SSOSignInType {
  id: number;
  ext_id: number | null;
  username: string;
  role?: string | null;
  tags?: number[] | null;
}

/**
 * SSOSignupType interface
 */
export interface SSOSignUpType {
  id: number;
  ext_id?: number | null;
  username: string;
  email: string;
  role?: string | null;
  tags?: number[] | null;
}
