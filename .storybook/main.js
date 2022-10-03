const path = require("path");
const toPath = (filePath) => path.join(process.cwd(), filePath);
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  "staticDirs": ['../public'],
  "framework": '@storybook/react',
  "core": {
    "builder": 'webpack5',
    "options": {
      "lazyCompilation": true,
      "fsCache": true
    },
  },
  "stories": [
    "../packages/react-core/src/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/react-ui/src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/react-ui/src/shared/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/react-templates/src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
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
        "plugins": [
          ...(config.resolve.plugins || []),
          new TsconfigPathsPlugin({
            extensions: config.resolve.extensions,
          }),
        ],
        "alias": {
          ...config.resolve.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "@emotion/styled": require.resolve('@emotion/styled'),
          "emotion-theming": toPath("node_modules/@emotion/react"),
          "@selfcommunity/types": toPath("packages/types/src"), // development
          "@selfcommunity/utils": toPath("packages/utils/src"), // development
          "@selfcommunity/api-services": toPath("packages/api-services/src"), // development
          "@selfcommunity/react-i18n": toPath("packages/react-i18n/src"), // development
          "@selfcommunity/react-core": toPath("packages/react-core/src"), // development
          "@selfcommunity/react-ui": toPath("packages/react-ui/src"), // development
          "@selfcommunity/react-templates": toPath("packages/react-templates/src") // development
        },
      },
    };
  }
}
