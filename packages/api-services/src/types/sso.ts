/**
 * SSOSignUpParams
 */

export interface SSOSignUpParams {
  ext_id?: string;
  username: string;
  email: string;
  password?: string;
  role?: string | null;
  tags?: number[] | null;
}
