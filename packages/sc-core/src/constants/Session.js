export const COOKIE_SESSION = 'Cookie';
export const JWT_SESSION = 'JWT';
export const OAUTH_SESSION = 'OAuth';
export const sessionTypes = [JWT_SESSION, OAUTH_SESSION, COOKIE_SESSION];

export const ACCESS_OAUTH_TOKEN_REFRESH_IN_TIME = 30; // seconds (30 seconds)
export const ACCESS_JWT_TOKEN_REFRESH_IN_TIME = 60; // in seconds (1 minute)
