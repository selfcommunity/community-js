const path = require("path");
const toPath = (filePath) => path.join(process.cwd(), filePath);

/*
Fix Storybook v6.3.10 with mui v5
Check this issue to resolve mui problems in DOCs tab of storybook
https://github.com/mui-org/material-ui/issues/28716
After Storybook fix the problem remove "webpackFinal" in the following export
 */

module.exports = {
  "reactOptions": {
    "fastRefresh": true
  },
  "stories": [
    "../packages/sc-core/src/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/sc-ui/src/components/**/*.stories.@(js|jsx|ts|tsx)",
    // "../packages/sc-templates/src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    "@storybook/addon-links",
    "@storybook/addon-essentials"
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
          "@selfcommunity/core": toPath("packages/sc-core/src"), // development
          "@selfcommunity/ui": toPath("packages/sc-ui/src"), // development
          "@selfcommunity/templates": toPath("packages/sc-templates/src") // development
        },
      },
    };
  }
}
