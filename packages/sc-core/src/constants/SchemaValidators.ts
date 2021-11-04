import {Schema} from 'typy';

/**
 * Schema token
 * @type {{access_token: string, refresh_token: string}}
 */
const tokenSchema = {
  access_token: Schema.String,
  refresh_token: Schema.String,
  expires_in: Schema.Number,
};

/**
 * Schema router
 * @type {{routes: {notification: string, post: string, profile: string, home: string}, history: boolean}}
 */
const routerSchema = {
  history: Schema.Boolean,
  routes: {
    home: Schema.String,
    profile: Schema.String,
    notification: Schema.String,
    post: Schema.String,
    discussion: Schema.String,
  },
};

export {tokenSchema, routerSchema};
