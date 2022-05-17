import * as jose from 'jose';

/**
 * Generate a JWT
 :::tipContext can be consumed as following:
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
export async function generateJWTToken(userId, secretKey, expirationTime) {
  let data = {
    token_type: 'access',
    userId: userId
  };
  const privateKey = new TextEncoder().encode(secretKey);
  return await new jose.SignJWT(data)
    .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
    .setIssuedAt()
    .setExpirationTime(expirationTime ? expirationTime : '2h')
    .sign(privateKey);
}
