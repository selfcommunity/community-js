module.exports = {
  roots: ['<rootDir>/test'],
  testRegex: '-test\\.(j|t)sx?$',
  setupFilesAfterEnv: [require.resolve('./test/index.js')],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {rootMode: 'upward'}]
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '@selfcommunity/utils': '<rootDir>/../utils/src/'
  }
};
process.env = Object.assign(process.env, {
  SERVICES_PLATFORM_URL: 'https://italiano.quentrix.com',
  SERVICES_SECRET_KEY: '2|~./YJ8r}4?&3V_xr=?r5gwGQaN2-z<@q=W)b}mQ&lc<G1fWFZ',
  SERVICES_ADMIN_USER_ID: 1,
  SERVICES_USER_ID: 7
});
