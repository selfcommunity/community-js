import {generateJWTToken} from '../src/utils/token';
import client from '../src/client';

global.beforeEach(async () => {
  let token;
  token = await generateJWTToken(process.env.SERVICES_USER_ID, process.env.SERVICES_SECRET_KEY);
  client.setBasePortal(process.env.SERVICES_PLATFORM_URL);
  client.setAuthorizeToken(token);
});
