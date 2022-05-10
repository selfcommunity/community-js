import {jsonwebtoken as jwt} from 'jsonwebtoken';

/**
 * Generate a token (type=JWT) for user identified by userId
 * @param userId
 * @param secretKey
 * @param expiresIn
 */
export function generateJWTToken(userId: string, secretKey: string, expiresIn?: string): string {
  if (!userId || !secretKey) {
    return null;
  }
  let data = {
    token_type: 'access',
    user_id: 7,
    jti: new Date().getTime()
  };
  return jwt.sign(data, secretKey, {
    algorithm: 'HS256',
    expiresIn: expiresIn || '30h',
    header: {typ: 'JWT'}
  });
}
