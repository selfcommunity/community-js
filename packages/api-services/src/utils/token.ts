import * as jose from 'jose';

/**
 * Generate a JWT
 :::tip Context can be consumed as following:
 ```jsx
 1. const token = await generateJWTToken(userId, secretKey, expirationTime);
 ```
 ```jsx
 2. generateJWTToken(userId, secretKey, expirationTime).then(token => {...});
 ```
 :::
 * @param userId
 * @param secretKey
 * @param expirationTime
 */
export async function generateJWTToken(userId, secretKey, expirationTime = '2h') {
  let data = {
    token_type: 'access',
    user_id: userId,
    jti: new Date().getTime().toString()
  };
  const privateKey = new TextEncoder().encode(secretKey);
  return await new jose.SignJWT(data)
    .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
    .setIssuedAt()
    .setExpirationTime(expirationTime ? expirationTime : '2h')
    .sign(privateKey);
}

/**
 * Extract from a jwt token payload
 * @param token
 */
export function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}
