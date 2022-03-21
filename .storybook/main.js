const path = require("path");
const toPath = (filePath) => path.join(process.cwd(), filePath);

module.exports = {
  staticDirs: ['../public'],
  "reactOptions": {
    "fastRefresh": true
  },
  "stories": [
    "../packages/sc-core/src/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/sc-ui/src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/sc-ui/src/shared/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/sc-templates/src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-toolbars",
  ],
  "features": {
    "postcss": false
  },
  "webpackFinal": async (config) => {
    return {
      ...config,
      "resolve": {
        ...config.resolve,
        "alias": {
          ...config.resolve.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "@emotion/styled": require.resolve('@emotion/styled'),
          "emotion-theming": toPath("node_modules/@emotion/react"),
          "@selfcommunity/i18n": toPath("packages/sc-i18n/src"), // development
          "@selfcommunity/core": toPath("packages/sc-core/src"), // development
          "@selfcommunity/ui": toPath("packages/sc-ui/src"), // development
          "@selfcommunity/templates": toPath("packages/sc-templates/src") // development
        },
      },
    };
  }
}
